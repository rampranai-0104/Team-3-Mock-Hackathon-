const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { sendSuccess, sendError } = require('./utils/apiResponse');

// Import artist routes
const artistProfileRoutes = require('./routes/artist/profileRoutes');
const artistRequestRoutes = require('./routes/artist/requestRoutes');
const artistEventRoutes = require('./routes/artist/eventRoutes');
const artistEarningsRoutes = require('./routes/artist/earningsRoutes');
const artistFollowerRoutes = require('./routes/artist/followerRoutes');
const artistProductRoutes = require('./routes/artist/productRoutes');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  return sendSuccess(res, 'Tvarita API is healthy', {
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Artist Portal Route Mountings
app.use('/api/artists/me/requests', artistRequestRoutes);
app.use('/api/artists/me/events', artistEventRoutes);
app.use('/api/artists/me/earnings', artistEarningsRoutes);
app.use('/api/artists/me/followers', artistFollowerRoutes);
app.use('/api/artists/me/products', artistProductRoutes);
app.use('/api/artists', artistProfileRoutes); // Handles /api/artists/me and /api/artists/me/media

// Catch 404 routes
app.use((req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, null, 404);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  return sendError(
    res,
    'Internal server error',
    process.env.NODE_ENV === 'development' ? err.message : null,
    500
  );
});

module.exports = app;
