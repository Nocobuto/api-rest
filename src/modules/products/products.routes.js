const { Router } = require('express');
const { body } = require('express-validator');
const { getAll, getById, create, update, remove } = require('./products.controller');
const { verifyToken } = require('../../middlewares/auth');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: CRUD de productos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar productos con paginación y búsqueda
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto (requiere autenticación)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string, example: Laptop Pro }
 *               description: { type: string }
 *               price: { type: number, example: 999.99 }
 *               stock: { type: integer, example: 50 }
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autenticado
 */
router.post(
  '/',
  verifyToken,
  [
    body('name').trim().notEmpty().withMessage('El nombre es requerido'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un entero positivo'),
  ],
  create
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto (propietario o admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *     responses:
 *       200:
 *         description: Actualizado
 *       403:
 *         description: Sin permiso
 */
router.put(
  '/:id',
  verifyToken,
  [
    body('price').optional().isFloat({ min: 0 }).withMessage('Precio inválido'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock inválido'),
  ],
  update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar producto (propietario o admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Eliminado
 *       403:
 *         description: Sin permiso
 */
router.delete('/:id', verifyToken, remove);

module.exports = router;
