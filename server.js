'use strict';
const Express = require('express');
const BodyParser = require('body-parser');
const Joi = require('joi')
    .extend(require('joi-extension-semver'));

const Vuln = require('./lib/vuln');
const Config = require('./lib/config').getConfig();

const PAYLOAD_SCHEMA = Joi.array()
    .items(Joi.object().keys({
        name: Joi.string().min(1).required(),
        version: Joi.semver().valid().required()
    }));

const app = Express();
app.use(BodyParser.json());

const validateBody = function (req, res, next) {

    Joi.validate(req.body, PAYLOAD_SCHEMA, (err) => {

        if (err) {
            return next(err);
        }
        return next();
    });
};

app.post('/advisories', validateBody, (req, res, next) => {

    Vuln.batchSearch(req.body)
        .then((x) => res.json(x))
        .catch(next)
});

app.listen(Config.port, () => {

    console.log('ok')
});
