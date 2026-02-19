require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./modules/auth/auth.routes');
const productsRoutes = require('./modules/products/products.routes');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
        imgSrc: ["'self'", "data:", "cdnjs.cloudflare.com"],
      },
    },
  })
);

app.use(cors());
app.use(express.json());

app.get('/api-docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

app.get('/api-docs', (req, res) => {
  const swaggerJsonUrl = process.env.NODE_ENV === 'production'
    ? 'https://api-rest-production-44e6.up.railway.app/api-docs/swagger.json'
    : 'http://localhost:3000/api-docs/swagger.json';

  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>API Docs</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js"></script>
    <script>
      window.onload = function() {
        SwaggerUIBundle({
          url: "${swaggerJsonUrl}",
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis],
          layout: "BaseLayout"
        });
      }
    </script>
  </body>
</html>`);
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API REST funcionando',
    docs: '/api-docs',
    version: '1.0.0',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación en http://localhost:${PORT}/api-docs`);
});