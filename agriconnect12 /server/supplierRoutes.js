const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const snapshot = await db.collection('suppliers').get();
    const suppliers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, location, contact } = req.body;
    if (!name || !location || !contact) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const docRef = await db.collection('suppliers').add({
      name,
      location,
      contact,
      status: 'Active',
      createdAt: new Date()
    });
    res.status(201).json({ id: docRef.id, name, location, contact, status: 'Active' });
  } catch (error) {
    console.error('Error adding supplier:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, contact } = req.body;
    if (!name || !location || !contact) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    await db.collection('suppliers').doc(id).update({
      name,
      location,
      contact,
      updatedAt: new Date()
    });
    res.json({ id, name, location, contact });
  } catch (error) {
    console.error('Error updating supplier:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('suppliers').doc(id).delete();
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    console.error('Error deleting supplier:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;