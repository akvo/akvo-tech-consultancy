import axios from "axios";
const API = "/api/";

const token = document.querySelector('meta[name="csrf-token"]').content;

const header = {
    "Content-Type": "multipart/form-data",
    "X-CSRF-TOKEN": token,
};

export const getApi = (endpoint) => {
    return new Promise((resolve, reject) => {
        const cached = localStorage.getItem(endpoint);
        if (cached !== null) {
            resolve({
                [endpoint]: JSON.parse(cached),
            });
        } else {
            axios
                .get(API + endpoint)
                .then((res) => {
                    const data = JSON.stringify(res.data);
                    localStorage.setItem(endpoint, data);
                    resolve({
                        [endpoint]: res.data,
                    });
                })
                .catch((err) => reject("internal server error"));
        }
    });
};

export const postApi = (endpoint) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            axios.post(API + endpoint, header).then((res) => {
                resolve({
                    [endpoint]: res.data,
                });
            });
        }, 300);
    });
};

export const queueApi = (index, urls, length, callback, params = []) => {
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
        cached().then((res) => {
            callback(res, params[index]);
            queueApi(current, urls, length, callback, params);
        });
    } else {
        axios.get(API + url).then((res) => {
            const cache = JSON.stringify(res.data);
            localStorage.setItem(url, cache);
            callback(res.data, params[index]);
            queueApi(current, urls, length, callback, params);
        });
    }
};

export const login = (credentials) => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/auth/login", credentials)
            .then((res) => {
                if (res.status === 200) {
                    resolve({ login: true, ...res.data.user, access_token: res.data.access_token });
                } else {
                    resolve({ login: false, error: "Internal Server Error" });
                }
            })
            .catch((error) => {
                if (error.response) {
                    let err = error.response.data;
                    reject({ error: err.message });
                }
            });
    });
};

export const logout = (access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/auth/logout", {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + access_token,
                },
            })
            .then((res) => {
                localStorage.removeItem("access_token")
                resolve({ login: false });
            })
            .catch((err) => {
                resolve(err.message);
            });
    });
};

export const auth = (access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .get("/api/user", {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + access_token,
                },
            })
            .then((res) => {
                resolve({ login: true, ...res.data });
            })
            .catch((err) => {
                resolve(err.message);
            });
    });
};

export const updateUser = (access_token, credentials) => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/user/update", credentials, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + access_token,
                },
            })
            .then((res) => {
                resolve({variant: "success", message:res.data.message, active:true})
            })
            .catch((err) => {
                resolve({variant: "danger", message:"invalid password", active:true})
            })

    });
}

export const getUser = (access_token) => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/user/list", false,{
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + access_token,
                },
            })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                resolve("unauthorized")
            })
    })
}

export const accessUser = (access_token, data) => {
    return new Promise((resolve, reject) => {
        axios
            .post("/api/user/access", data, {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + access_token,
                },
            })
            .then((res) => {
                resolve({variant: "success", message:res.data.message, active:true})
            })
            .catch((err) => {
                resolve({variant: "danger", message:"user not found", active:true})
            })
    })
}
