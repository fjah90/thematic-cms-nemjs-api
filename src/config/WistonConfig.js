const winston = require('winston');

const logger = winston.createLogger({
    level: 'info', // Adjust the logging level as needed
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Optional: Add timestamps
        winston.format.printf((info) => `${info.level}: ${info.message} - ${info.timestamp}`) // Customize log format
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug', // Only log debug and above in development mode
            silent: process.env.NODE_ENV === 'production' // Suppress console logging in production
        })
    ]
});

module.exports = logger;