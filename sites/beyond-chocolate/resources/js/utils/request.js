import axios from "axios";

const request = function() {
    const req = axios.create({ withCredentials: true });

    req.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    return req;
};

export default request;
