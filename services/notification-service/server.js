const express = require('express');
const app = express();
const port = 3005;

// Middleware
app.use(express.json());

app.listen(port, () => {
    console.log(`Service Notification sedang berjalan ${port}`);
});