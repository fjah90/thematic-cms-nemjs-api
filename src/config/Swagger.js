const appConfig = require('./AppConfig');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: appConfig.appName,
        version: appConfig.appVersion,
        description:
            'This is a REST API application made with Express. ' + appConfig.appDescription,
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
            name: 'Fernando Aponte',
            url: 'https://github.com/fjah90',
        },
    },
    servers: [
        {
            url: 'http://localhost:' + appConfig.port,
            description: appConfig.enviroment +' server',
        },
    ],
};
const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    app.use(appConfig.apiPrefix + '/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}