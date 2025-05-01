const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authenticate = require('../middleware/auth');

router.get('/data', authenticate, async (req, res) => {
  try {
    // Fetch inventory data
    const inventorySnapshot = await db.collection('inventory').get();
    const inventory = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalItems = inventory.length;
    const totalQuantity = inventory.reduce((sum, item) => sum + (item.unit === 'kg' ? item.quantity : 0), 0);

    // Fetch purchase orders
    const purchasesSnapshot = await db.collection('purchases').get();
    const purchases = purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const pendingOrders = purchases.filter(p => p.status === 'Pending').length;
    const thisWeekPending = purchases.filter(p => {
      const date = new Date(p.deliveryDate);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      return p.status === 'Pending' && date >= weekStart;
    }).length;

    // Fetch suppliers
    const suppliersSnapshot = await db.collection('suppliers').get();
    const suppliers = suppliersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;

    // Mock payment data (since payprocess.html is not implemented)
    const totalPaymentsDue = 50000; // Placeholder
    const overduePayments = 5000; // Placeholder

    // Mock recent orders and supplier performance
    const recentOrders = purchases.slice(0, 5).map(p => ({
      id: p.id,
      vegetable: p.vegetables?.[0]?.name || 'Unknown',
      quantity: p.vegetables?.[0]?.quantity || 0,
      customer: p.name,
      date: p.deliveryDate,
      status: p.status
    }));

    const supplierPerformance = suppliers.map(s => ({
      name: s.name,
      category: s.category || 'Vegetables',
      rating: s.rating || 4.0,
      orders: purchases.filter(p => p.supplierId === s.id).length,
      status: s.status || 'Active',
      avatar: s.avatar || 'https://via.placeholder.com/40'
    }));

    res.json({
      totalSuppliers: suppliers.length,
      activeSuppliers,
      totalPendingOrders: pendingOrders,
      thisWeekPendingOrders: thisWeekPending,
      inventoryLevel: totalItems > 0 ? (totalQuantity / 2000 * 100).toFixed(2) : 0,
      totalQuantity,
      totalInventoryCapacity: 2000,
      totalPaymentsDue,
      overduePayments,
      recentOrders,
      supplierPerformance
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;