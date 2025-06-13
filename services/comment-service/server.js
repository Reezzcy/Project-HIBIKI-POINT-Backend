const express = require('express');
const app = express();
const port = 3003;

// Middleware
app.use(express.json());

app.listen(port, () => {
    console.log(`Service Comment sedang berjalan ${port}`);
});