import axios from 'axios';
import { API_URL } from './Environment'

export const getApi = (url) => new Promise((resolve, reject) => {
    const now = new Date();
    let data = sessionStorage.getItem(url);
    let cachetime = sessionStorage.getItem('cache-time');
    cachetime = cachetime !== null
        ? new Date(parseInt(cachetime) + (1 * 60 * 1000))
        : new Date(0);
    if (data === null || now > cachetime) {
        axios.get(API_URL + url).then(res => {
            sessionStorage.setItem('cache-time', now.getTime());
            sessionStorage.setItem(url, JSON.stringify(res.data));
            resolve(res.data);
        })
    }
    if (data !== null && now < cachetime) {
        resolve(JSON.parse(data));
    }
});
