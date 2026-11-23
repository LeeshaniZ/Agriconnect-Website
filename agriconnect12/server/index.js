require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = Number.parseInt(process.env.PORT || '5000', 10);
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5000,http://127.0.0.1:5000,http://localhost:5500,http://127.0.0.1:5500')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header include same-origin and command-line clients.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

const publicDirectory = path.resolve(__dirname, '../public');
app.use(express.static(publicDirectory));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AgriConnect API' });
});

app.use('/api/dashboard', require('./dashboardRoutes'));
app.use('/api/inventory', require('./inventoryRoutes'));
app.use('/api/purchases', require('./purchaseRoutes'));
app.use('/api/suppliers', require('./supplierRoutes'));
app.use('/api/users', require('./userRoutes'));

app.use((error, _req, res, _next) => {
  console.error('Unhandled request error:', error.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`AgriConnect server listening on http://localhost:${PORT}`);
  console.log(`Serving frontend files from ${publicDirectory}`);
});

module.exports = app;
