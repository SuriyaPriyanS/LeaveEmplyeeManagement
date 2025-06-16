import connection from '../Databases/Config.js';
import bcrypt from 'bcryptjs';

const User2 = {
  // Create a new user in users2
  create: async (email, username, password, role = 'employee') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO users2 (email, username, password, role) VALUES (?, ?, ?, ?)',
        [email, username, hashedPassword, role],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  // Find user by email in users2
  findByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM users2 WHERE email = ?',
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]); // Return first match
        }
      );
    });
  },

  // Get all users from users2
  findAll: async () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT id, username, email, role FROM users2',
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  // Delete user by ID from users2
  delete: async (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM users2 WHERE id = ?',
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
};

export default User2;
