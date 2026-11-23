const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authenticate = require('./auth');

router.post('/signup', authenticate, async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const tokenEmail = typeof req.user.email === 'string' ? req.user.email.trim().toLowerCase() : '';
    const requestedEmail = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

    if (!username || !tokenEmail || tokenEmail !== requestedEmail) {
      return res.status(400).json({ error: 'A valid username and matching authenticated email are required' });
    }

    await db.collection('users').doc(req.user.uid).set({
      username,
      email: tokenEmail,
      createdAt: new Date()
    }, { merge: true });

    return res.status(201).json({ message: 'User profile created' });
  } catch (error) {
    console.error('Error creating user profile:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
