const express = require('express');
const app = express();
const port = 3007;

// Middleware
app.use(express.json());

app.listen(port, () => {
    console.log(`Service User sedang berjalan ${port}`);
});