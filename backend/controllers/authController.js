const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup Controller
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token
    });

  } catch (err) {
    console.error('Signup Error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Email must be unique' });
    }
    res.status(500).json({ msg: 'Signup failed. Please try again.' });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ msg: 'Login failed. Please try again.' });
  }
};

module.exports = {
  signupUser,
  loginUser
};
