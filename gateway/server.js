// const express = require('express');
// const routes = require('../routes');

// const swaggerUi = require('swagger-ui-express');
// const swaggerFile = require('../docs/swagger-output.json');

// require('dotenv').config();
// const db = require('../shared/config/db');
// const redisClient = require('../shared/config/redis');
// const calendarRoutes = require('../routes/calendarRoutes');

// const server = express();
// const port = process.env.PORT || 3000;

// // Middleware
// server.use(express.json());

// // Sinkronisasi dengan database
// db.sync({ alter: true })
//     .then(() => console.log('Database & tables created!'))
//     .catch((err) => console.error('Error syncing database:', err));

// // Swagger Docs
// server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// // Routing
// server.use(routes);

// // Root
// server.get('/', (req, res) => {
//     res.send('Welcome to HIBIKI POINT!');
// });

// // Google Calendar
// server.use('/api/calendar', calendarRoutes);

// // Menjalankan server
// server.listen(port, () => {
//     console.log(`HIBIKI POINT listening at http://localhost:${port}`);
// });

const express = require('express');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../docs/swagger-output.json');

require('dotenv').config();
const db = require('../shared/config/db');
const redisClient = require('../shared/config/redis');

const server = express();
const port = process.env.PORT || 3000;

// Middleware
server.use(express.json());

// Sinkronisasi dengan database
db.sync({ alter: true })
    .then(() => console.log('Database & tables created!'))
    .catch((err) => console.error('Error syncing database:', err));

// Swagger Docs
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/attachment', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/serviceTest': '/testRewrite'
    }
}));

app.use('/campaign', createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/serviceMahasiswa': '/api/mahasiswa'
    }
}));

app.use('/comment', createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    pathRewrite: {
        '^/serviceMahasiswa': '/api/mahasiswa'
    }
}));

app.use('/logactivity', createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    pathRewrite: {
        '^/serviceMahasiswa': '/api/mahasiswa'
    }
}));

app.use('/notification', createProxyMiddleware({
    target: 'http://localhost:3005',
    changeOrigin: true,
    pathRewrite: {
        '^/serviceMahasiswa': '/api/mahasiswa'
    }
}));

app.use('/task', createProxyMiddleware({
    target: 'http://localhost:3006',
    changeOrigin: true,
    pathRewrite: {
        '^/serviceMahasiswa': '/api/mahasiswa'
    }
}));

app.use('/user', createProxyMiddleware({
    target: 'http://localhost:3007',
    changeOrigin: true,
    pathRewrite: {
        '^/serviceMahasiswa': '/api/mahasiswa'
    }
}));

// // Menjalankan server
server.listen(port, () => {
    console.log(`HIBIKI POINT listening at http://localhost:${port}`);
});