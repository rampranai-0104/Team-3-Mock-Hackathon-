const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Person-1: Route Imports
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

// School / Corporate (Institution) Routes (Placeholders for later Person-1 steps)
const institutionRoutes = require('./routes/institution/institutionRoutes');
const experienceRoutes = require('./routes/institution/experienceRoutes');
const requestRoutes = require('./routes/institution/requestRoutes');
const bookingRoutes = require('./routes/institution/bookingRoutes');
const orderRoutes = require('./routes/institution/orderRoutes');

// Community Routes (Person-1)
const publicCommunityRoutes = require('./routes/public/communityRoutes');
const institutionCommunityRoutes = require('./routes/institution/communityRoutes');

// Middleware
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// ==========================================
// Global Middleware Configuration
// ==========================================
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads folder (local fallback alongside Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// Health & Diagnostic Endpoint
// ==========================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
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
app.use('/api/artists', artistRoutes);
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
// API Routes: PERSON-2 PLACEHOLDERS (To be added later)
// ==========================================
// app.use('/api/artists/me', artistPortalRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/notifications', notificationRoutes);

// ==========================================
// 404 Handler for Unmatched API Routes
// ==========================================
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
});

// ==========================================
// Global Error Handler
// ==========================================
app.use(errorHandler);

module.exports = app;
