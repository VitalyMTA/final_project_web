const DEFAULT_TIMEOUT_MS = 10000;
const { Agent } = require('undici');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.CPANEL_POKEDEX_API_URL || '';
const listUrl = process.env.CPANEL_POKEDEX_LIST_URL || '';
const addUrl = process.env.CPANEL_POKEDEX_ADD_URL || '';

const defaultPayloadFormat = (process.env.CPANEL_POKEDEX_PAYLOAD_FORMAT || 'form').toLowerCase();
const defaultMethod = (process.env.CPANEL_POKEDEX_METHOD || 'POST').toUpperCase();

const listMethod = (process.env.CPANEL_POKEDEX_LIST_METHOD || defaultMethod).toUpperCase();
const addMethod = (process.env.CPANEL_POKEDEX_ADD_METHOD || defaultMethod).toUpperCase();

const apiKey = process.env.CPANEL_POKEDEX_API_KEY || '';
const apiKeyHeader = process.env.CPANEL_POKEDEX_API_KEY_HEADER || 'x-api-key';
const allowSelfSigned = String(process.env.CPANEL_POKEDEX_ALLOW_SELF_SIGNED || '').toLowerCase() === 'true';

const dispatcher = allowSelfSigned
    ? new Agent({ connect: { rejectUnauthorized: false } })
    : undefined;

const resolveUrl = (operation) => {
    if (operation === 'list') {
        return listUrl || baseUrl;
    }

    if (operation === 'add') {
        return addUrl || baseUrl;
    }

    return baseUrl;
};

const resolveMethod = (operation) => {
    if (operation === 'list') {
        return listMethod;
    }

    if (operation === 'add') {
        return addMethod;
    }

    return defaultMethod;
};

const isConfigured = () => Boolean(resolveUrl('list') || resolveUrl('add') || baseUrl);

const getStatus = () => {
    const listEndpoint = resolveUrl('list');
    const addEndpoint = resolveUrl('add');
    return {
        isConfigured: isConfigured(),
        listEndpoint,
        addEndpoint,
        payloadFormat: defaultPayloadFormat,
        listMethod,
        addMethod,
        hasApiKey: Boolean(apiKey)
    };
};

const safeJson = async (response) => {
    const text = await response.text();
    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch (err) {
        return null;
    }
};

const request = async (action, payload = {}) => {
    const operation = payload && payload.__operation ? payload.__operation : 'generic';
    const requestPayload = { ...payload };
    delete requestPayload.__operation;

    const url = resolveUrl(operation);
    if (!url) {
        throw new Error('CPANEL_POKEDEX_API_URL is not configured');
    }

    const method = resolveMethod(operation);
    const requestData = { action, ...requestPayload };
    const multipartFile = requestData.__multipartFile || null;
    delete requestData.__multipartFile;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
        const headers = {};
        if (apiKey) {
            headers[apiKeyHeader] = apiKey;
        }

        let requestUrl = url;
        let body;

        if (method === 'GET') {
            const query = new URLSearchParams(requestData).toString();
            requestUrl = requestUrl.includes('?') ? `${requestUrl}&${query}` : `${requestUrl}?${query}`;
        } else if (multipartFile && multipartFile.filePath && multipartFile.fieldName) {
            const formData = new FormData();

            Object.entries(requestData).forEach(([key, value]) => {
                if (value === undefined || value === null) {
                    return;
                }
                formData.append(key, String(value));
            });

            console.log('📤 Reading file from:', multipartFile.filePath);
            const fileBuffer = await fs.promises.readFile(multipartFile.filePath);
            console.log('📤 File buffer size:', fileBuffer.length, 'bytes');
            const fileName = multipartFile.fileName || path.basename(multipartFile.filePath);
            console.log('📤 Sending as filename:', fileName);
            const fileBlob = new Blob([fileBuffer], { type: 'application/octet-stream' });
            formData.append(multipartFile.fieldName, fileBlob, fileName);

            body = formData;
        } else if (defaultPayloadFormat === 'json') {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(requestData);
        } else {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            body = new URLSearchParams(requestData).toString();
        }

        const response = await fetch(requestUrl, {
            method,
            headers,
            body,
            dispatcher,
            signal: controller.signal
        });

        const data = await safeJson(response);
        const result = data === null ? { success: response.ok } : data;

        console.log('📡 cPanel Response:', {
            status: response.status,
            ok: response.ok,
            result: result
        });

        if (!response.ok) {
            const message = result && result.message ? result.message : `cPanel API failed with status ${response.status}`;
            throw new Error(message);
        }

        if (result && result.success === false) {
            const message = result.error || result.message || 'cPanel API returned success=false';
            throw new Error(message);
        }

        return result;
    } finally {
        clearTimeout(timeout);
    }
};

module.exports = {
    isConfigured,
    getStatus,
    request
};
