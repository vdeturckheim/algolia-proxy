'use strict';
const Joi = require('joi')
    .extend(require('joi-extension-semver'));

const PAYLOAD_SCHEMA = Joi.array()
    .items(Joi.object().keys({
        name: Joi.string().min(1).required(),
        version: Joi.semver().valid().required()
    }));

module.exports.body = function (req, res, next) {

    Joi.validate(req.body, PAYLOAD_SCHEMA, (err) => {

        if (err) {
            return next(err);
        }
        return next();
    });
};
