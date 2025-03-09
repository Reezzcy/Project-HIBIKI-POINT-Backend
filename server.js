const express = require('express');
const routes = require('./routes');

require('dotenv').config();
const db = require('./utils/db');

const server = express();
const port = process.env.PORT || 3000;

// Middleware
server.use(express.json());

// Sinkronisasi dengan database
db.sync({ alter: true })
    .then(() => console.log('Database & tables created!'))
    .catch(err => console.error('Error syncing database:', err));

// Routing
server.use(routes);

// Root
server.get('/', (req, res) => {
    res.send('Welcome to HIBIKI POINT!');
});

// Menjalankan server
server.listen(port, () => {
    console.log(`HIBIKI POINT listening at http://localhost:${port}`);
});
