'use strict';
const { parentPort, workerData } = require('worker_threads');
const ValidateLib = require('./lib');

const payload = workerData;
ValidateLib.validate(payload, (err) => {

    parentPort.postMessage(err);
});


