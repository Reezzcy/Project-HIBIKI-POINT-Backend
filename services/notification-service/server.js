require('dotenv').config();
const express = require('express');
const { startConsumer } = require('./src/consumer');
const { sequelize } = require('./src/models/notification');
const notificationRoutes = require('./src/routes/notificationRoutes');
const swaggerSpecs = require('./src/config/swagger');

const server = express();
const port = process.env.PORT || 3003;

// Middleware
server.use(express.json());

// Sinkronisasi database
sequelize
    .sync({ alter: true })
    .then(() => console.log('Notification-Service Database & tables created!'))
    .catch((err) => console.error('Error syncing database:', err));

server.use(express.json());

// Routing
server.use('/api', notificationRoutes);

// Root
server.get('/', (req, res) => {
    res.send('Welcome to HIBIKI POINT - Notification Service!');
});

// Swagger
server.get('/api-spec.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
});

server.listen(port, async () => {
    console.log(
        `Notification Service API listening at http://localhost:${port}`
    );

    await startConsumer();
});
