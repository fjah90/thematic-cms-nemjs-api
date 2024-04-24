const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import application routes
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const thematicRoutes = require('./routes/thematics');
const contentRoutes = require('./routes/content');

// Initialize Express app
const app = express();

// Load environment variables
dotenv.config();

// Extract environment variables
const DB_CONNECT = process.env.DB_CONNECT;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB database!');
});

// Configure Express Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/thematics', thematicRoutes);
app.use('/api/content', contentRoutes);

// Error handling middleware to catch and respond to errors globally
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);

    res.status(error.statusCode || 500).json({
        message: error.message || 'Internal server error',
    });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
