const helmet = require('helmet');

const helmetModule = (app, options) => {
    const helmetOptions = options || {
        contentSecurityPolicy: {
            directives: {
                'default-src': ['self'],
                'script-src': ['self', 'unsafe-inline'],
                'style-src': ['self', 'unsafe-inline'],
                'img-src': ['self', 'data:'],
                'font-src': ['self'],
                'object-src': ['none'],
                'connect-src': ['self'],
            }
        },
        crossOriginEmbedderPolicy: true,
        hsts: {
            maxAge: 31536000, // 1 año en segundos
            includeSubDomains: true,
            preload: true
        }
    };


    // Aplica Helmet a la aplicación Express
    app.use(helmet(helmetOptions));
};

module.exports = helmetModule;