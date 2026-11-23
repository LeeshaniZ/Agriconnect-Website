const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authenticate = require('./auth');

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
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanStatus = typeof status === 'string' ? status.trim() : '';
    const parsedDate = Date.parse(deliveryDate);
    const parsedTotal = totalAmount === undefined || totalAmount === null ? 0 : Number(totalAmount);

    if (!cleanName || !cleanStatus || !Array.isArray(vegetables) || vegetables.length === 0 ||
        !deliveryDate || Number.isNaN(parsedDate) || !Number.isFinite(parsedTotal) || parsedTotal < 0) {
      return res.status(400).json({ error: 'A name, valid delivery date, at least one vegetable and a non-negative total are required' });
    }

    const docRef = await db.collection('purchases').add({
      name: cleanName,
      supplierId: supplierId || null,
      deliveryDate,
      vegetables,
      status: cleanStatus,
      totalAmount: parsedTotal,
      createdAt: new Date()
    });
    res.status(201).json({ id: docRef.id, name: cleanName, supplierId, deliveryDate, vegetables, status: cleanStatus, totalAmount: parsedTotal });
  } catch (error) {
    console.error('Error creating purchase:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, supplierId, deliveryDate, vegetables, status, totalAmount } = req.body;
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanStatus = typeof status === 'string' ? status.trim() : '';
    const parsedDate = Date.parse(deliveryDate);
    const parsedTotal = totalAmount === undefined || totalAmount === null ? 0 : Number(totalAmount);

    if (!cleanName || !cleanStatus || !Array.isArray(vegetables) || vegetables.length === 0 ||
        !deliveryDate || Number.isNaN(parsedDate) || !Number.isFinite(parsedTotal) || parsedTotal < 0) {
      return res.status(400).json({ error: 'A name, valid delivery date, at least one vegetable and a non-negative total are required' });
    }

    await db.collection('purchases').doc(id).update({
      name: cleanName,
      supplierId: supplierId || null,
      deliveryDate,
      vegetables,
      status: cleanStatus,
      totalAmount: parsedTotal,
      updatedAt: new Date()
    });
    res.json({ id, name: cleanName, supplierId, deliveryDate, vegetables, status: cleanStatus, totalAmount: parsedTotal });
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