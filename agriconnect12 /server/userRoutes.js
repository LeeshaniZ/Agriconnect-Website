const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');

router.post('/signup', async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    await db.collection('users').doc(email).set({
      username,
      email,
      createdAt: new Date()
    });
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;