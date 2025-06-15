const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Logging Service API', // Judul spesifik untuk service ini
            version: '1.0.0',
            description:
                'API documentation for the Logging Service, which handles logging and monitoring for the application.',
        },
        // Penting: Definisikan base path yang akan digunakan oleh Gateway
        servers: [
            {
                url: '/api', // Ini adalah path yang akan dilihat oleh frontend
            },
        ],
    },
    // Path ke file-file API (routes) Anda untuk didokumentasikan
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
