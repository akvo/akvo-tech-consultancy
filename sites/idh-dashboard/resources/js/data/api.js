import axios from 'axios';
const API = process.env.MIX_PUBLIC_URL + "/api/";

const token = document.querySelector('meta[name="csrf-token"]').content;

const header = {
    'Content-Type':'multipart/form-data',
    'X-CSRF-TOKEN': token
}

export const getApi = (endpoint) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.get(API + endpoint).then(res => {
                resolve({
                    [endpoint] : res.data
                })
            });
        }, 300)
    });
}

export const postApi = (endpoint) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.post(API + endpoint, header).then(res => {
                resolve({
                    [endpoint] : res.data
                })
            });
        }, 300)
    });
}

export const queueApi = (index, urls, length, callback, params=[]) => {
    const current = index + 1;
    if (length === index) {
        return;
    }
    const url = urls[index];
    const storage = localStorage.getItem(url);
    if (storage !== null) {
        const cached = () => {
            return new Promise((resolve, reject) => {
                resolve(JSON.parse(storage));
            });
        };
        cached().then(
            res => {
                callback(res, params[index]);
                queueApi(current, urls, length, callback, params);
            }
        );
    } else {
        axios.get(API + url).then(res => {
            const cache = JSON.stringify(res.data);
            localStorage.setItem(url, cache);
            callback(res.data, params[index]);
            queueApi(current, urls, length, callback, params);
        });
    }
}
