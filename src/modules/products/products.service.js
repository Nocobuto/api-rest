const pool = require('../../config/db');

const getAll = async ({ page = 1, limit = 10, search = '' }) => {
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;

  const result = await pool.query(
    `SELECT p.*, u.name as creator_name
     FROM products p
     LEFT JOIN users u ON p.user_id = u.id
     WHERE p.name ILIKE $1 OR p.description ILIKE $1
     ORDER BY p.created_at DESC
     LIMIT $2 OFFSET $3`,
    [searchTerm, limit, offset]
  );

  const countResult = await pool.query(
    'SELECT COUNT(*) FROM products WHERE name ILIKE $1 OR description ILIKE $1',
    [searchTerm]
  );

  return {
    data: result.rows,
    pagination: {
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult.rows[0].count / limit),
    },
  };
};

const getById = async (id) => {
  const result = await pool.query(
    `SELECT p.*, u.name as creator_name
     FROM products p
     LEFT JOIN users u ON p.user_id = u.id
     WHERE p.id = $1`,
    [id]
  );
  if (!result.rows[0]) throw new Error('Producto no encontrado');
  return result.rows[0];
};

const create = async ({ name, description, price, stock }, userId) => {
  const result = await pool.query(
    `INSERT INTO products (name, description, price, stock, user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description, price, stock || 0, userId]
  );
  return result.rows[0];
};

const update = async (id, { name, description, price, stock }, user) => {
  const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!existing.rows[0]) throw new Error('Producto no encontrado');

  if (existing.rows[0].user_id !== user.id && user.role !== 'admin') {
    throw new Error('No tienes permiso para modificar este producto');
  }

  const result = await pool.query(
    `UPDATE products
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         price = COALESCE($3, price),
         stock = COALESCE($4, stock),
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [name, description, price, stock, id]
  );
  return result.rows[0];
};

const remove = async (id, user) => {
  const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (!existing.rows[0]) throw new Error('Producto no encontrado');

  if (existing.rows[0].user_id !== user.id && user.role !== 'admin') {
    throw new Error('No tienes permiso para eliminar este producto');
  }

  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  return { message: 'Producto eliminado correctamente' };
};

module.exports = { getAll, getById, create, update, remove };
