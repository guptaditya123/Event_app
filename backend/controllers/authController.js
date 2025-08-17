import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ===== SIGNUP =====
export const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    console.log('Signup request:', { name, email, password });

    // Trim inputs
    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!email.endsWith('@iimcal.ac.in')) {
      console.log('Invalid email domain:', email);
      return res.status(400).json({ message: 'Only iimcal.ac.in emails allowed' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log('User created successfully:', user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: err.message });
  }
};

// ===== LOGIN =====
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log('Login request:', { email, password });

    // Trim inputs
    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch, {
      enteredPassword: password,
      hashedPassword: user.password,
    });

    if (!isMatch) {
      console.log('Incorrect password for user:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful for user:', email);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
};
