const express = require('express');
const app = express();
const port = 3006;

// Middleware
app.use(express.json());

app.listen(port, () => {
    console.log(`Service Task sedang berjalan ${port}`);
});