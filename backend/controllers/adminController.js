const db = require('../config/db');

// GET /admin/users — all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: rows });
  } catch (err) {
    console.error('Admin getUsers error:', err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// GET /admin/predictions — all predictions with user info
const getAllPredictions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.id,
        u.name AS user_name,
        u.email,
        p.image_path,
        p.predicted_disease,
        p.confidence,
        p.created_at
      FROM predictions p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json({ predictions: rows });
  } catch (err) {
    console.error('Admin getPredictions error:', err);
    res.status(500).json({ error: 'Failed to fetch predictions.' });
  }
};

// GET /admin/stats — dashboard summary numbers
const getStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await db.query(
      'SELECT COUNT(*) AS total_users FROM users WHERE role = "user"'
    );
    const [[{ total_predictions }]] = await db.query(
      'SELECT COUNT(*) AS total_predictions FROM predictions'
    );
    const [[{ total_admins }]] = await db.query(
      'SELECT COUNT(*) AS total_admins FROM users WHERE role = "admin"'
    );

    // Disease frequency breakdown for analytics chart
    const [disease_breakdown] = await db.query(`
      SELECT predicted_disease, COUNT(*) AS count
      FROM predictions
      GROUP BY predicted_disease
      ORDER BY count DESC
    `);

    res.json({
      stats: {
        total_users,
        total_predictions,
        total_admins,
        disease_breakdown
      }
    });
  } catch (err) {
    console.error('Admin getStats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

// DELETE /admin/users/:id — delete a user (and their predictions)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Safety: don't allow deleting admins via this route
  try {
    const [user] = await db.query('SELECT role FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user[0].role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin accounts.' });
    }

    // Delete predictions first (foreign key constraint)
    await db.query('DELETE FROM predictions WHERE user_id = ?', [id]);
    await db.query('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Admin deleteUser error:', err);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

module.exports = { getAllUsers, getAllPredictions, getStats, deleteUser };
