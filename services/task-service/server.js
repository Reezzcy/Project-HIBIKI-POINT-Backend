require('dotenv').config();
const express = require('express');
const { sequelize } = require('./src/models');
const campaignRoutes = require('./src/routes/campaignRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const { connectPublisher } = require('./src/publisher');
const swaggerFile = require('./docs/swagger-output.json');

const server = express();
const port = process.env.PORT || 3004;

// Middleware
server.use(express.json());

// Sinkronisasi database
sequelize
    .sync({ alter: true })
    .then(() => console.log('User-Service Database & tables created!'))
    .catch((err) => console.error('Error syncing database:', err));

// Routing
server.use('/campaign', campaignRoutes);
server.use('/comment', commentRoutes);
server.use('/report', reportRoutes);
server.use('/task', taskRoutes);

// Root
server.get('/', (req, res) => {
    res.send('Welcome to HIBIKI POINT - Task Service!');
});

// Swagger
server.get('/api-spec.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerFile);
});

// Menjalankan server
server.listen(port, async () => {
    console.log(`Task Service listening API at http://localhost:${port}`);

    await connectPublisher();
});
