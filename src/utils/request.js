const nodeFetch = require('node-fetch');
const fetch = require('fetch-cookie')(nodeFetch);

const defaultGetOpts = {
    method: 'GET',
    credentials: 'includes',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
    }
};

const defaultPostOpts = {
    method: 'POST',
    credentials: 'includes',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
    }
};

async function get(url, body = {}, headers = {}, opts = {}) {
    const query = object2Query(body);
    const curOpts = {
        ...defaultGetOpts,
        headers: {
            ...defaultGetOpts.headers,
            ...headers
        }
    };
    const delimiter = url.indexOf('?') !== -1 ?
        (url.indexOf('?') === url.length - 1 || !query ? '' : '&') :
        (query ? '?' : '');

    const response = await fetch(`${url}${delimiter}${query}`, curOpts);
    return response;
}

async function getJson(url, body = {}, headers = {}, opts = {}) {
    const response = await get(url, body, headers, opts);
    return await response.json();
}

async function getText(url, body = {}, headers = {}, opts = {}) {
    const response = await get(url, body, headers, opts);
    return await response.text();
}

async function post(url, body = {}, headers = {}, opts = {}) {
    const curOpts = {
        ...defaultPostOpts,
        body: object2Query(body),
        headers: {
            ...defaultPostOpts.headers,
            ...headers
        }
    };
    const response = await fetch(url, curOpts);
    return response;
}

function object2Query(obj) {
    let query = '';
    for (const key in obj) {
        const value = obj[key];
        if (query) query += '&';
        query += `${key}=${value}`;
    }
    return query;
}

module.exports = {
    get,
    getJson,
    getText,
    post
};