const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// --- REGISTER ---
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: fullName,
      email,
      password: hashedPassword, // Fixed: should match your User.js model field 'password'
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, email: newUser.email, username: newUser.username }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- GET PROFILE ---
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "bio"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- UPDATE PROFILE ---
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) return res.status(400).json({ message: "Username taken" });
    }

    await user.update({
      username: username || user.username,
      bio: bio !== undefined ? bio : user.bio,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};