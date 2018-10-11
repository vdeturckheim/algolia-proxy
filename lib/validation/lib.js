'use strict';
const Joi = require('joi')
    .extend(require('joi-extension-semver'));

const PAYLOAD_SCHEMA = Joi.array()
    .items(Joi.object().keys({
        name: Joi.string().min(1).required(),
        version: Joi.semver().valid().required()
    }));

module.exports.validate = function (payload, cb) {

    Joi.validate(payload, PAYLOAD_SCHEMA, (err) => {

        setImmediate(() => {
            if (err) {
                return cb(err);
            }
            return cb();
        });
    });
};

