const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API Documentation',
        description: 'API Hibiki-Point',
    },
    host: 'localhost:3003',
    schemes: ['https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../server'];

swaggerAutogen(outputFile, endpointsFiles, doc);