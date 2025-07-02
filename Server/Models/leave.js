import connection from '../Databases/Config.js';

// Utility function to validate dates
const validateDates = (startDate, endDate) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }

  if (start < currentDate) {
    throw new Error('Start date cannot be in the past');
  }

  if (end <= start) {
    throw new Error('End date must be after start date');
  }

  return { start, end };
};

const Leave = {
  create: async (userId, type, startDate, endDate, reason) => {
    return new Promise((resolve, reject) => {
      try {
        validateDates(startDate, endDate);

        const validTypes = ['Annual', 'Sick', 'Casual'];
        if (!validTypes.includes(type)) {
          return reject(new Error('Invalid leave type. Must be one of: Annual, Sick, Casual'));
        }

        const status = 'pending';

        connection.query(
          'INSERT INTO leaves1 (user_id, type, start_date, end_date, reason, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [userId, type, startDate, endDate, reason, status],
          (err, result) => {
            if (err) {
              return reject(new Error(`Failed to create leave: ${err.message}`));
            }
            resolve({ insertId: result.insertId });
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  },

  findByUserId: async (userId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM leaves1 WHERE user_id = ? ORDER BY created_at DESC',
        [userId],
        (err, results) => {
          if (err) {
            return reject(new Error(`Failed to fetch leaves: ${err.message}`));
          }
          resolve(results);
        }
      );
    });
  },

  findAll: async () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT l.*, u.username, u.email FROM leaves1 l JOIN users2 u ON l.user_id = u.id ORDER BY l.created_at DESC',
        (err, results) => {
          if (err) {
            return reject(new Error(`Failed to fetch all leaves: ${err.message}`));
          }
          resolve(results);
        }
      );
    });
  },

  findById: async (leaveId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM leaves1 WHERE id = ?',
        [leaveId],
        (err, results) => {
          if (err) {
            return reject(new Error(`Failed to fetch leave: ${err.message}`));
          }
          resolve(results[0]);
        }
      );
    });
  },

  updateStatus: async (leaveId, status) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE leaves1 SET status = ? WHERE id = ?',
        [status, leaveId],
        (err, result) => {
          if (err) {
            return reject(new Error(`Failed to update leave status: ${err.message}`));
          }
          resolve(result);
        }
      );
    });
  },

  delete: async (leaveId) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM leaves1 WHERE id = ?',
        [leaveId],
        (err, result) => {
          if (err) {
            return reject(new Error(`Failed to delete leave: ${err.message}`));
          }
          resolve(result);
        }
      );
    });
  }
};

export default Leave;
