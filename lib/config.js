'use strict';

module.exports.getConfig = function () {

    if (process.env.NODE_ENV === 'dev') {
        return require('../dev.config.json');
    }

    return {
        algolia: {
            applicationID: process.env.ALGOLIA_ID,
            apiKey: process.env.ALGOLIA_KEY,
            index: process.env.ALGOLIA_INDEX
        },
        port: process.env.PORT
    }
};

