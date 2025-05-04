const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const snapshot = await db.collection('purchases').get();
    const purchases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, supplierId, deliveryDate, vegetables, status, totalAmount } = req.body;
    if (!name || !deliveryDate || !vegetables || !status) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const docRef = await db.collection('purchases').add({
      name,
      supplierId: supplierId || null,
      deliveryDate,
      vegetables,
      status,
      totalAmount: totalAmount || 0,
      createdAt: new Date()
    });
    res.status(201).json({ id: docRef.id, name, supplierId, deliveryDate, vegetables, status, totalAmount });
  } catch (error) {
    console.error('Error creating purchase:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, supplierId, deliveryDate, vegetables, status, totalAmount } = req.body;
    if (!name || !deliveryDate || !vegetables || !status) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    await db.collection('purchases').doc(id).update({
      name,
      supplierId: supplierId || null,
      deliveryDate,
      vegetables,
      status,
      totalAmount: totalAmount || 0,
      updatedAt: new Date()
    });
    res.json({ id, name, supplierId, deliveryDate, vegetables, status, totalAmount });
  } catch (error) {
    console.error('Error updating purchase:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('purchases').doc(id).delete();
    res.json({ message: 'Purchase deleted' });
  } catch (error) {
    console.error('Error deleting purchase:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;