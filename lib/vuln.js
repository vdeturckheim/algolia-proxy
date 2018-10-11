'use strict';
const Algolia = require('algoliasearch');
const Semver = require('semver');

const Config = require('./config').getConfig();

const client = Algolia(Config.algolia.applicationID, Config.algolia.apiKey);
const index = client.initIndex(Config.algolia.index);

module.exports.batchSearch = async function (items) {

    const filters = Array.from(new Set(items.map((x) => `module_name:${x.name}`))).join(' OR ');

    const results = await index.search('', { filters });
    const hits = results.hits;
    const vulns = {};
    hits.forEach((hit) => {

        vulns[hit.module_name] = vulns[hit.module_name] || [];
        vulns[hit.module_name].push(hit);
    });

    const response = {};
    items.forEach(({ name, version }) => {

        if (vulns[name] !== undefined) {
            const currentVulns = vulns[name].filter((x) => Semver.satisfies(version, x.vulnerable_versions));
            if (currentVulns.length > 0) {
                response[name] = response[name] || {};
                response[name][version] = currentVulns;
            }
        }
    });

    return response;
};
