const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Service API', // Judul spesifik untuk service ini
            version: '1.0.0',
            description:
                'API documentation for the User Service, which handles user management, authentication, and authorization for the application.',
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
