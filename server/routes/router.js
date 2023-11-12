const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, age } = req.body;
    const user = new User({ name, age });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create a user.' });
  }
});

// Get a list of all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch users.' });
  }
});

// Get a specific user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch the user.' });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const { name, age } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, age },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update the user.' });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete the user.' });
  }
});

module.exports = router;