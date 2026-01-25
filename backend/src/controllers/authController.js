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
      password: hashedPassword,
    });

    // ✅ FIXED: Added role to token payload
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role }
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

    const isMatch = (password === user.password) || await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // ✅ FIXED: Added role to the JWT payload
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- GET PROFILE ---
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "bio", "role"],
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

// --- GET ALL USERS ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ✅ FIXED: Added deleteUser function
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id == id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};