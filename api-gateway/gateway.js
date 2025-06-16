require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const fetch = require('node-fetch');

// ===============================================
// 1. PENGATURAN DASAR & MIDDLEWARE KEAMANAN
// ===============================================

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.set('trust proxy', 1);

// Aktifkan CORS untuk semua permintaan
app.use(cors());

// Replikasi Rate Limiter dari monolith Anda
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Batasi setiap IP hingga 100 permintaan per jendela
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 10, // Batasi setiap IP hingga 10 permintaan login
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Terapkan limiter dasar ke semua rute /api
app.use('/api', apiLimiter);

// ===============================================
// 2. MIDDLEWARE OTENTIKASI (SANG "SATPAM")
// ===============================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res
            .status(401)
            .json({ message: 'Authentication token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res
                .status(403)
                .json({ message: 'Invalid or expired token' });
        }
        // Jika token valid, tambahkan info user ke request
        // Service internal bisa langsung percaya ini
        req.user = user;
        next();
    });
};

// ===============================================
// 3. SWAGGER AGGREGATION
// ===============================================
// Fungsi untuk mengambil spec dari setiap service
const fetchSwaggerSpec = async (serviceUrl) => {
    try {
        const response = await fetch(`${serviceUrl}/api-spec.json`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`Error fetching spec from ${serviceUrl}:`, error.message);
        return null;
    }
};

// Setup rute untuk Swagger UI
app.use('/api-docs', swaggerUi.serve, async (req, res) => {
    try {
        // Ambil semua spec dari service yang relevan
        const taskSpec = await fetchSwaggerSpec(process.env.TASK_SERVICE_URL);
        const userSpec = await fetchSwaggerSpec(process.env.USER_SERVICE_URL);

        // Definisikan spec dasar untuk Gateway
        const gatewaySpec = {
            openapi: '3.0.0',
            info: {
                title: 'Hibiki Point - Unified API',
                version: '1.0.0',
                description:
                    'Dokumentasi terpusat untuk semua microservice Hibiki Point.',
            },
            paths: {},
            components: { schemas: {} },
            tags: [],
        };

        // Gabungkan semua spesifikasi menjadi satu
        [taskSpec, userSpec].forEach((spec) => {
            if (spec) {
                gatewaySpec.paths = { ...gatewaySpec.paths, ...spec.paths };
                gatewaySpec.components.schemas = {
                    ...gatewaySpec.components.schemas,
                    ...spec.components.schemas,
                };
                gatewaySpec.tags = [...gatewaySpec.tags, ...spec.tags];
            }
        });

        // Sajikan UI dengan spesifikasi yang sudah digabung
        const swaggerUiHandler = swaggerUi.setup(gatewaySpec);
        swaggerUiHandler(req, res);
    } catch (error) {
        res.status(500).send('Unable to load API specs');
    }
});

// ===============================================
// 4. ATURAN ROUTING (SANG "PAPAN PETUNJUK")
// ===============================================

// Ambil URL service dari environment variables
const {
    USER_SERVICE_URL,
    TASK_SERVICE_URL,
    NOTIFICATION_SERVICE_URL,
    LOGGING_SERVICE_URL,
} = process.env;

// Opsi untuk proxy, termasuk pathRewrite
const proxyOptions = {
    changeOrigin: true,
    // Menulis ulang path, misal: /api/tasks -> /tasks
    pathRewrite: { '^/api': '' },
};

// Rute Publik (tidak perlu token)
app.use(
    '/api/auth',
    loginLimiter,
    createProxyMiddleware({ target: USER_SERVICE_URL, ...proxyOptions })
);

// Rute yang Membutuhkan Otentikasi
// Perhatikan penggunaan middleware `authenticateToken` sebelum proxy
app.use(
    '/api/users',
    authenticateToken,
    createProxyMiddleware({ target: USER_SERVICE_URL, ...proxyOptions })
);

// Semua rute produktivitas diarahkan ke Task Service
app.use(
    '/api/tasks',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/campaigns',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/comments',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/reminders',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/attachments',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/reports',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/calendar',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);

// Rute untuk service pendukung (jika perlu diakses dari luar)
app.use(
    '/api/notifications',
    authenticateToken,
    createProxyMiddleware({ target: NOTIFICATION_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/logs',
    authenticateToken,
    createProxyMiddleware({ target: LOGGING_SERVICE_URL, ...proxyOptions })
);

app.get('/', (req, res) => res.send('API Gateway is running.'));

// ===============================================
// 5. JALANKAN SERVER
// ===============================================
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
