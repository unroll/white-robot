const nodeFetch = require('node-fetch');
const createFetch = require('fetch-cookie');
const tough = require('tough-cookie');

class RequestUtil {

    constructor() {
        this.cookies = new tough.CookieJar();
        this.fetch = createFetch(nodeFetch, this.cookies);

        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36';
        this.defaultGetOpts = {
            method: 'GET',
            headers: {
                'User-Agent': userAgent
            }
        };

        this.defaultPostOpts = {
            method: 'POST',
            headers: {
                'User-Agent': userAgent,
                'Content-Type': 'application/json'
            }
        };
    }

    async post(url, body = {}, headers = {}, opts = {}) {
        const curOpts = {
            ...this.defaultPostOpts,
            ...opts,
            body: JSON.stringify(body),
            headers: {
                ...this.defaultPostOpts.headers,
                ...headers
            }
        };
        const response = await this.fetch(url, curOpts);
        return response;
    }

    async get(url, body = {}, headers = {}, opts = {}) {
        const query = object2query(body);
        const curOpts = {
            ...this.defaultGetOpts,
            ...opts,
            headers: {
                ...this.defaultGetOpts.headers,
                ...headers
            }
        };
        const delimiter = url.indexOf('?') !== -1 ?
            (url.indexOf('?') === url.length - 1 || !query ? '' : '&') :
            (query ? '?' : '');

        const response = await this.fetch(`${url}${delimiter}${query}`, curOpts);
        return response;
    }
}

function object2query(obj) {
    let query = '';
    for (const key in obj) {
        const value = obj[key];
        if (query) query += '&';
        query += `${key}=${value}`;
    }
    return query;
}

module.exports = RequestUtil;