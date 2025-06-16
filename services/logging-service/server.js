require('dotenv').config();
const express = require('express');
const { startConsumer } = require('./src/consumer');
const { sequelize } = require('./src/models/logActivity');
const logRoutes = require('./src/routes/logActivityRoutes');
const swaggerFile = require('./docs/swagger-output.json');
const server = express();
const port = process.env.PORT || 3002;

// Middleware
server.use(express.json());

// Sinkronisasi database
sequelize
    .sync({ alter: true })
    .then(() => console.log('Logging-Service Database & tables created!'))
    .catch((err) => console.error('Error syncing database:', err));

server.use(express.json());

// Routing
server.use('/logs', logRoutes);

// Root
server.get('/', (req, res) => {
    res.send('Welcome to HIBIKI POINT - Logging Service!');
});

// Swagger
server.get('/api-spec.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerFile);
});

server.listen(port, async () => {
    console.log(`Logging Service API listening at http://localhost:${port}`);

    await startConsumer();
});
