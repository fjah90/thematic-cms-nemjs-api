// Import required modules
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// Import configuration required modules
const appConfig = require('./config/AppConfig');
const swagger = require('./config/Swagger');
const connectDB = require('./config/DatabaseConfig');
const helmetModule = require('./config/HelmetConfig'); 
const logger = require('./config/WistonConfig');

// Import application routes
const authRoutes = require('./routes/auth');

// Load environment variables
const PORT = appConfig.port;

// Initialize Express app
const app = express();

// Configure Express Middleware
app.use(express.json());
helmetModule(app);
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register API Routes
app.use(appConfig.apiPrefix + '/auth', authRoutes);

// Error handling middleware to catch and respond to errors globally
app.use((error, req, res, next) => {
    logger.error('Global error handler:', error);

    res.status(error.statusCode || 500).json({
        message: error.message || 'Internal server error',
    });
});

// setup a database connection using mongoose
connectDB()
    .then(() => {
        app.listen(8080, () => logger.info('Communication with database server started on port 8080'));
    })
    .catch(error => {
        logger.error('Error starting communication with database server:', error);
        process.exit(1);
    });

// Mount Swagger
swagger(app);

// Start Express Server
app.listen(PORT, () => {
    const message = `Server started on port ${PORT}`;
    process.env.NODE_ENV === 'production' ? console.info(message) : logger.info(message);
});
