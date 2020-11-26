import axios from 'axios';
import { API_URL } from './Environment'

export const getApi = (url) => new Promise((resolve, reject) => {
    let data = sessionStorage.getItem(url);
    if (data === null) {
        axios.get(API_URL + url).then(res => {
            sessionStorage.setItem(url, JSON.stringify(res.data));
            resolve(res.data);
        })
    }
    if (data !== null) {
        resolve(JSON.parse(data));
    }
});
