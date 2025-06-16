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
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ error: 'Token not Found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(`Authenticated user: ${req.user}`);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token Invalid' });
    }
};

// ===============================================
// 3. SWAGGER AGGREGATION
// ===============================================
// Fungsi untuk mengambil spec dari setiap service
const fetchSwaggerSpec = async (serviceUrl) => {
    try {
        const response = await fetch(`${serviceUrl}/api-spec.json`);
        if (!response.ok) return null;
        console.log(`Fetched spec from ${serviceUrl}`);
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
        const notificationSpec = await fetchSwaggerSpec(process.env.NOTIFICATION_SERVICE_URL);
        const loggingSpec = await fetchSwaggerSpec(process.env.LOGGING_SERVICE_URL);

        const mergedSpec = {
            swagger: '2.0',
            info: {
                title: 'Hibiki Point - Unified API',
                version: '1.0.0',
                description: 'Dokumentasi terpusat untuk semua microservice Hibiki Point.',
            },
            host: 'localhost:3004', // ganti sesuai gateway
            basePath: '/',
            schemes: ['https'],
            paths: {},
            definitions: {},
            tags: [],
        };

        // Asumsikan kamu sudah load ini dari file atau HTTP
        const specs = [userSpec, taskSpec, notificationSpec, loggingSpec];

        specs.forEach((spec) => {
            if (!spec || typeof spec !== 'object') return;

            // Gabungkan PATHs
            if (spec.paths) {
                for (const [path, methods] of Object.entries(spec.paths)) {
                    if (!mergedSpec.paths[path]) {
                        mergedSpec.paths[path] = methods;
                    } else {
                        // Gabungkan metode (get/post/etc) kalau path-nya sama
                        mergedSpec.paths[path] = {
                            ...mergedSpec.paths[path],
                            ...methods,
                        };
                    }
                }
            }

            // Gabungkan DEFINITIONS (Swagger 2.0)
            if (spec.definitions) {
                mergedSpec.definitions = {
                    ...mergedSpec.definitions,
                    ...spec.definitions,
                };
            }

            // Gabungkan TAGS dengan dedup
            if (spec.tags && Array.isArray(spec.tags)) {
                for (const tag of spec.tags) {
                    if (!mergedSpec.tags.some((t) => t.name === tag.name)) {
                        mergedSpec.tags.push(tag);
                    }
                }
            }
        });

        console.log(`gatewaySpec ${mergedSpec}`);

        // Sajikan UI dengan spesifikasi yang sudah digabung
        const swaggerUiHandler = swaggerUi.setup(mergedSpec);
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

const createServiceProxy = (target) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        onProxyReq: (proxyReq, req, res) => {
            // Meneruskan data user sebagai header jika tersedia
            if (req.user) {
                // Untuk debugging
                console.log('Forwarding user data:', JSON.stringify(req.user));

                // Encode data user sebagai base64 string
                const userDataString = JSON.stringify(req.user);
                proxyReq.setHeader('X-User-Data', Buffer.from(userDataString).toString('base64'));
            }
        }
    });
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
    '/api/user',
    authenticateToken,
    createProxyMiddleware({ target: USER_SERVICE_URL, ...proxyOptions })
);

// Semua rute produktivitas diarahkan ke Task Service
app.use(
    '/api/task',
    authenticateToken,
    createServiceProxy(TASK_SERVICE_URL)
);
app.use(
    '/api/campaign',
    authenticateToken,
    createServiceProxy(TASK_SERVICE_URL)
);
app.use(
    '/api/comment',
    authenticateToken,
    createServiceProxy(TASK_SERVICE_URL)
);
app.use(
    '/api/reminder',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/attachment',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);
app.use(
    '/api/report',
    authenticateToken,
    createServiceProxy(TASK_SERVICE_URL)
);
app.use(
    '/api/calendar',
    authenticateToken,
    createProxyMiddleware({ target: TASK_SERVICE_URL, ...proxyOptions })
);

// Rute untuk service pendukung (jika perlu diakses dari luar)
app.use(
    '/api/notification',
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

module.exports = {
    authenticateToken
}; // Ekspor app untuk testing atau penggunaan lain