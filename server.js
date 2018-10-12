'use strict';
const Express = require('express');
const BodyParser = require('body-parser');

const Vuln = require('./lib/vuln');
const Config = require('./lib/config').getConfig();
const Validate = require('./lib/validate');

const app = Express();
app.use(BodyParser.json());

app.post('/advisories/ecosystem', Validate.body, (req, res, next) => {

    Vuln.batchSearch(req.body)
        .then((x) => res.json(x))
        .catch(next)
});

app.use((err, req, res, next) => {

    console.log(err);
    if (err.isJoi) {
        res.status(400);
        return res.json(err);
    }
    return next(err);
});


app.listen(Config.port, () => {

    console.log(`App listening on port ${Config.port}`)
});
