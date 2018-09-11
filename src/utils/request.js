const fetch = require('node-fetch');

const defaultGetHeaders = {
    method: 'GET',
    credentials: 'includes',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
};

const defaultPostHeaders = {
    method: 'POST',
    credentials: 'includes',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36'
};

async function get(url, body = {}, headers = {}) {
    const query = objectToQuery(body);
    const curHeaders = {
        ...defaultGetHeaders,
        ...headers
    };

    const response = await fetch(`${url}?${query}`, curHeaders);
    return response;
}

async function getJson(url, body = {}, headers = {}) {
    const response = await get(url, body, headers);
    return await response.json();
}

async function getText(url, body = {}, headers = {}) {
    const response = await get(url, body, headers);
    return await response.text();
}

async function post(url, body = {}, headers = {}) {
    const curHeaders = {
        ...defaultPostHeaders,
        ...headers,
        body: objectToQuery(body)
    };
    const response = await fetch(url, curHeaders);
    return response;
}

function objectToQuery(obj) {
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