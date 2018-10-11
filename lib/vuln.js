'use strict';
const Algolia = require('algoliasearch');
const Semver = require('semver');

const Config = require('./config').getConfig();

const client = Algolia(Config.algolia.applicationID, Config.algolia.apiKey);
const index = client.initIndex(Config.algolia.index);

const SEARCH_PARAMS = {
    restrictSearchableAttributes: ['module_name'],
    queryType: 'prefixNone',
    typoTolerance: false
}; // TODO: find a way to do exact matches here

const search = async function (pkg, version) {

    return (await index.search(pkg, SEARCH_PARAMS))
        .hits
        .filter((item) => item.module_name === pkg && Semver.satisfies(version, item.vulnerable_versions));
};

module.exports.batchSearch = async function (items) {

    const result = {};
    for (const { name, version } of items) {
        result[name] = result[name] || {};
        if (result[name][version]) {
            continue;
        }
        result[name][version] = await search(name, version);
    }
    return result;
};

