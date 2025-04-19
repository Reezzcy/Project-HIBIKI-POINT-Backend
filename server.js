const express = require('express');
const routes = require('./routes');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./docs/swagger-output.json');

require('dotenv').config();
const db = require('./config/db');
const redisClient = require('./config/redis');
const calendarRoutes = require('./routes/calendarRoutes');

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

// Routing
server.use(routes);

// Root
server.get('/', (req, res) => {
    res.send('Welcome to HIBIKI POINT!');
});

// Google Calendar
server.use('/api/calendar', calendarRoutes);

// Menjalankan server
server.listen(port, () => {
    console.log(`HIBIKI POINT listening at http://localhost:${port}`);
});
