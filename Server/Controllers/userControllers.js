import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users2 from '../Models/User.js'; // This is your users2 table model

export const register = async (req, res) => {
  const { email, name, password, role } = req.body;
  console.log('Registering user:', { email, name, role });

  try {
    await Users2.create(email, name, password, role);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users2.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users2.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    await Users2.delete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
