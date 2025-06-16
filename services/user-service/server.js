require('dotenv').config();
const express = require('express');
const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { connectPublisher } = require('./src/publisher');
const swaggerFile = require('./docs/swagger-output.json');

const server = express();
const port = process.env.PORT || 3001;

// Middleware
server.use(express.json());

// Sinkronisasi database
sequelize
    .sync({ alter: true })
    .then(() => console.log('User-Service Database & tables created!'))
    .catch((err) => console.error('Error syncing database:', err));

// Routing
server.use('/auth', authRoutes);
server.use('/user', userRoutes);

// Root
server.get('/', (req, res) => {
    res.send('Welcome to HIBIKI POINT - User Service!');
});

// Swagger
server.get('/api-spec.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerFile);
});

// Menjalankan server
server.listen(port, async () => {
    console.log(`User Service listening API at http://localhost:${port}`);

    await connectPublisher();
});
