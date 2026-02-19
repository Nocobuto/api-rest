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
        url: 'http://localhost:3000',
        description: 'Desarrollo',
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

// swagger-jsdoc puede exportar como función directa o con .default
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;