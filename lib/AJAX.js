'use strict';

const AJAX = {
    async get(url) {
        const response = await fetch(url);
        const data = await response.json();

        return data;
    },
    async post(url, body) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        return data;
    },
    async put(url, body) {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        
        return data;
    },
};