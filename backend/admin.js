const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addAdmin() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'skin_disease_db'
  });

  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'Admin User';
  
  const password_hash = await bcrypt.hash(password, 10);
  
  try {
    // Check if admin already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin user already exists!');
      // Update password just in case
      await pool.query('UPDATE users SET password_hash = ?, role = "admin" WHERE email = ?', [password_hash, email]);
      console.log('Admin password updated!');
    } else {
      // Create new admin
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, password_hash, 'admin']
      );
      console.log('Admin user created successfully!');
    }
    console.log('Admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

addAdmin();