import axios from "axios";

const simplifyResponse = response => {
    if (!response) return {};

    const common = {
        status: response.status,
        statusText: response.statusText,
        data: response.data
    };

    const formError =
        response.status === 422 || response.status === 429
            ? { errors: response.data?.errors || {} }
            : {};

    return { ...common, ...formError };
};

const request = function() {
    const req = axios.create({ withCredentials: true });

    req.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    req.interceptors.response.use(
        response => simplifyResponse(response),
        error => Promise.reject(simplifyResponse(error.response))
    );

    return req;
};

export default request;
