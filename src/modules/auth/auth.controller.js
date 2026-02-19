const { validationResult } = require('express-validator');
const authService = require('./auth.service');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, message: 'Usuario registrado', data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const data = await authService.login(req.body);
    res.json({ success: true, message: 'Login exitoso', data });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getProfile };