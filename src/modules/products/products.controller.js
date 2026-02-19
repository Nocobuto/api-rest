const { validationResult } = require('express-validator');
const productsService = require('./products.service');

const getAll = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const result = await productsService.getAll({ page, limit, search });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const product = await productsService.getById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const product = await productsService.create(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Producto creado', data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const product = await productsService.update(req.params.id, req.body, req.user);
    res.json({ success: true, message: 'Producto actualizado', data: product });
  } catch (error) {
    const status = error.message.includes('permiso') ? 403 : 404;
    res.status(status).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const result = await productsService.remove(req.params.id, req.user);
    res.json({ success: true, ...result });
  } catch (error) {
    const status = error.message.includes('permiso') ? 403 : 404;
    res.status(status).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
