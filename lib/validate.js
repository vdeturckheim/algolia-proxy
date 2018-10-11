'use strict';
const Path = require('path');
const { Worker } = require('worker_threads');
const Pool = require('worker-threads-pool');
const ValidateLib = require('./validation/lib');

const MAX_SYNC_BODY_LENGTH = 500;
const WORKER_FILE = Path.join(__dirname, 'validation', 'worker.js');

const pool = new Pool({ max: 3 });

let ctor = 0;

const validateInWorker = function (payload, cb) {

    pool.acquire(WORKER_FILE, { workerData: payload }, (worker) => {

        if (!worker instanceof Worker) {
            return cb(worker);
        }
        const id = ctor++;
        console.log(`Acquired worker ${id}`);

        worker.on('message', cb);
        worker.on('error', cb);
        worker.on('exit', () => {

            console.log(`Exiting worker ${id}`);
        });
    });
};

module.exports.body = function (req, res, next) {

    if (req.body.length !== undefined && req.body.length > MAX_SYNC_BODY_LENGTH) {
        return validateInWorker(req.body, next);
    }
    return ValidateLib.validate(req.body, next);
};
