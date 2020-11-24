import request from "../lib/request";

const register = async data => {
    return await request().post("/register", data);
};

export default { register };
