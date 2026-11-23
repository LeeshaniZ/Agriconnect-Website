const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authenticate = require('./auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const snapshot = await db.collection('inventory').get();
    const inventory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { item, quantity, unit } = req.body;
    const cleanItem = typeof item === 'string' ? item.trim() : '';
    const cleanUnit = typeof unit === 'string' ? unit.trim() : '';
    const numericQuantity = Number(quantity);

    if (!cleanItem || !cleanUnit || quantity === '' || !Number.isFinite(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ error: 'Item, unit and a non-negative numeric quantity are required' });
    }

    const docRef = await db.collection('inventory').add({
      item: cleanItem,
      quantity: numericQuantity,
      unit: cleanUnit,
      createdAt: new Date()
    });
    res.status(201).json({ id: docRef.id, item: cleanItem, quantity: numericQuantity, unit: cleanUnit });
  } catch (error) {
    console.error('Error adding inventory:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { item, quantity, unit } = req.body;
    const cleanItem = typeof item === 'string' ? item.trim() : '';
    const cleanUnit = typeof unit === 'string' ? unit.trim() : '';
    const numericQuantity = Number(quantity);

    if (!cleanItem || !cleanUnit || quantity === '' || !Number.isFinite(numericQuantity) || numericQuantity < 0) {
      return res.status(400).json({ error: 'Item, unit and a non-negative numeric quantity are required' });
    }

    await db.collection('inventory').doc(id).update({
      item: cleanItem,
      quantity: numericQuantity,
      unit: cleanUnit,
      updatedAt: new Date()
    });
    res.json({ id, item: cleanItem, quantity: numericQuantity, unit: cleanUnit });
  } catch (error) {
    console.error('Error updating inventory:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('inventory').doc(id).delete();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting inventory:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;