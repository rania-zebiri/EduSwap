require('dotenv').config(); // Load environment variables first
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initializeFirebaseAdmin } = require('./config/firebase-admin');
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Create Express app
const app = express();

// ======================
// Security Middleware
// ======================
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(',') || true,
  credentials: true
}));

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ======================
// Body Parsing
// ======================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ======================
// API Routes
// ======================
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/skills', require('./routes/skillRoutes'));

// ======================
// Health Check
// ======================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ======================
// Error Handling
// ======================
app.use(errorHandler);

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
  📅 ${new Date().toLocaleString()}
  🔗 Base URL: http://localhost:${PORT}/api/v1
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app; // For testing