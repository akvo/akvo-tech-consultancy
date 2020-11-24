import request from "../lib/request";

const login = async data => {
    await request().post("/login", data);
    return await getUser();
};
const logout = async () => {
    await request().post("/logout");
};
const getUser = async () => {
    try {
        const { data } = await request().get("/api/me");
        return data;
    } catch {}
    return false;
};

export default { login, logout, getUser };
