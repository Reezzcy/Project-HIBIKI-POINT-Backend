const express = require('express');
const app = express();
const port = 3004;

// Middleware
app.use(express.json());

app.listen(port, () => {
    console.log(`Service Log Activity sedang berjalan ${port}`);
});