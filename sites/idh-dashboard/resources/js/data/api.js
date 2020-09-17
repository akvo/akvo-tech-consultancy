import axios from 'axios';
const API = process.env.MIX_PUBLIC_URL + "/api/";

export const call = (endpoint) => {
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
