const express = require('express');
const routes = require('./routes');
const app = express();
const port = 3002;

// Middleware
app.use(express.json());

// Routing
app.use(routes);

app.listen(port, () => {
    console.log(`Service Campaign sedang berjalan ${port}`);
});