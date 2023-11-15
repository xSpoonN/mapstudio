const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

// Create a new person
router.post('/people', async (req, res) => {
  try {
    const { name, age } = req.body;
    const person = new Person({ name, age });
    await person.save();
    res.status(201).json(person);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create a person.' });
  }
});

// Get a list of all people
router.get('/people', async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch people.' });
  }
});

// Get a specific person by ID
router.get('/people/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Person not found.' });
    }
    res.status(200).json(person);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch the person.' });
  }
});

// Update a person by ID
router.put('/people/:id', async (req, res) => {
  try {
    const { name, age } = req.body;
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { name, age },
      { new: true }
    );
    if (!person) {
      return res.status(404).json({ error: 'Person not found.' });
    }
    res.status(200).json(person);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update the person.' });
  }
});

// Delete a person by ID
router.delete('/people/:id', async (req, res) => {
  try {
    const person = await Person.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Person not found.' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete the person.' });
  }
});

module.exports = router;