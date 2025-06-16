import pool from '../Databases/Config.js';

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY created DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new employee
export const addEmployee = async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    const [result] = await pool.query(
      'INSERT INTO employees (name, email, department, role) VALUES (?, ?, ?, ?)',
      [name, email, department, role]
    );
    // Fetch the newly created employee including the 'created' field
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an employee
export const updateEmployee = async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    await pool.query(
      'UPDATE employees SET name = ?, email = ?, department = ?, role = ? WHERE id = ?',
      [name, email, department, role, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};