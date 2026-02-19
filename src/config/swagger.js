const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST con Autenticación JWT',
      version: '1.0.0',
      description: 'API completa con autenticación, roles y CRUD de productos',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://api-rest-production-44e6.up.railway.app'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Producción' : 'Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;