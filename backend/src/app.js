const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { sendSuccess, sendError } = require('./utils/apiResponse');

// ==========================================
// Route Imports - Person 1 (Public, Auth, Institution)
// ==========================================
const authRoutes = require('./routes/authRoutes');

// Public / Civilian Routes
const artFormRoutes = require('./routes/public/artFormRoutes');
const artistRoutes = require('./routes/public/artistRoutes');
const eventRoutes = require('./routes/public/eventRoutes');
const productRoutes = require('./routes/public/productRoutes');
const knowledgeRoutes = require('./routes/public/knowledgeRoutes');
const learningRoutes = require('./routes/public/learningRoutes');
const followRoutes = require('./routes/public/followRoutes');
const activityRoutes = require('./routes/public/activityRoutes');
const searchRoutes = require('./routes/public/searchRoutes');

// School / Corporate (Institution) Routes
const institutionRoutes = require('./routes/institution/institutionRoutes');
const experienceRoutes = require('./routes/institution/experienceRoutes');
const requestRoutes = require('./routes/institution/requestRoutes');
const bookingRoutes = require('./routes/institution/bookingRoutes');
const orderRoutes = require('./routes/institution/orderRoutes');

// Community Routes
const publicCommunityRoutes = require('./routes/public/communityRoutes');
const institutionCommunityRoutes = require('./routes/institution/communityRoutes');

// Development / Testing Routes
const testRoutes = require('./routes/testRoutes');

// Middleware
const errorHandler = require('./middleware/errorMiddleware');

// ==========================================
// Route Imports - Person 2 (Artist & Admin)
// ==========================================
// Artist Routes
const artistProfileRoutes = require('./routes/artist/profileRoutes');
const artistRequestRoutes = require('./routes/artist/requestRoutes');
const artistEventRoutes = require('./routes/artist/eventRoutes');
const artistEarningsRoutes = require('./routes/artist/earningsRoutes');
const artistFollowerRoutes = require('./routes/artist/followerRoutes');
const artistProductRoutes = require('./routes/artist/productRoutes');

// Admin Part 1 Routes
const adminDashboardRoutes = require('./routes/admin/dashboardRoutes');
const adminAnalyticsRoutes = require('./routes/admin/analyticsRoutes');
const adminUserRoutes = require('./routes/admin/userRoutes');
const adminArtistRoutes = require('./routes/admin/artistRoutes');
const adminArtFormRoutes = require('./routes/admin/artFormRoutes');
const adminEventRoutes = require('./routes/admin/eventRoutes');

// Admin Part 2 Routes
const adminProductRoutes = require('./routes/admin/productRoutes');
const adminRequestRoutes = require('./routes/admin/requestRoutes');
const adminBookingRoutes = require('./routes/admin/bookingRoutes');
const adminOrderRoutes = require('./routes/admin/orderRoutes');
const adminKnowledgeRoutes = require('./routes/admin/knowledgeRoutes');

const app = express();

// ==========================================
// Global Middleware Configuration
// ==========================================
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static uploads folder (local fallback alongside Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// Health & Diagnostic Endpoint
// ==========================================
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Tvarita API is healthy',
    status: 'online',
    project: 'Tvarita Arts Collective API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// Authentication Route
// ==========================================
app.use('/api/auth', authRoutes);

// ==========================================
// Artist Portal Route Mountings (Person 2)
// Mounted before public /api/artists to handle /me
// ==========================================
app.use('/api/artists/me/requests', artistRequestRoutes);
app.use('/api/artists/me/events', artistEventRoutes);
app.use('/api/artists/me/earnings', artistEarningsRoutes);
app.use('/api/artists/me/followers', artistFollowerRoutes);
app.use('/api/artists/me/products', artistProductRoutes);
app.use('/api/artists', artistProfileRoutes); // Handles /api/artists/me and /api/artists/me/media

// ==========================================
// Admin Portal Route Mountings (Person 2)
// ==========================================
// Admin Part 1
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/artists', adminArtistRoutes);
app.use('/api/admin/art-forms', adminArtFormRoutes);
app.use('/api/admin/events', adminEventRoutes);

// Admin Part 2
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/requests', adminRequestRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/knowledge', adminKnowledgeRoutes);

// ==========================================
// Public / Civilian Portal Routes (/api/public)
// ==========================================
app.use('/api/public/art-forms', artFormRoutes);
app.use('/api/public/artists', artistRoutes);
app.use('/api/public/events', eventRoutes);
app.use('/api/public/products', productRoutes);
app.use('/api/public/knowledge', knowledgeRoutes);
app.use('/api/public/learning', learningRoutes);
app.use('/api/public/search', searchRoutes);
app.use('/api/public/activity', activityRoutes);
app.use('/api/public/community', publicCommunityRoutes);
app.use('/api/public', followRoutes); // Mounts /following & /artists/:artistId/follow

// ==========================================
// Route Aliases (Direct /api/... convention)
// ==========================================
app.use('/api/art-forms', artFormRoutes);
app.use('/api/artists', artistRoutes); // Public get / and /:id
app.use('/api/events', eventRoutes);
app.use('/api/products', productRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/community', publicCommunityRoutes);

// ==========================================
// School & Corporate (Institution) Routes
// ==========================================
app.use('/api/institutions/experiences', experienceRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/institution/community', institutionCommunityRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/orders', orderRoutes);

// ==========================================
// Test / Development Upload Route (Temporary)
// ==========================================
app.use('/api/test', testRoutes);

// ==========================================
// 404 Handler for Unmatched API Routes
// ==========================================
app.use('/api/*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(errorHandler);

module.exports = app;
