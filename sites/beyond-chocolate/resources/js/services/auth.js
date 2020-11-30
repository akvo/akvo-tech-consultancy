import request from "../lib/request";

const login = async data => {
    await request().get("sanctum/csrf-cookie");
    await request().post("/login", data);
    return await getUser();
};

const logout = async () => {
    await request().get("sanctum/csrf-cookie");
    await request().post("/logout");
};

const getUser = async () => {
    try {
        const { data } = await request().get("/api/me");
        return data;
    } catch {}
    return false;
};

const register = async data => {
    await request().get("sanctum/csrf-cookie");
    return await request().post("/register", data);
};

const forgotPassword = async data => {
    await request().get("sanctum/csrf-cookie");
    return await request().post("/forgot-password", data);
};

const resetPassword = async data => {
    await request().get("sanctum/csrf-cookie");
    return await request().post("/api/auth/reset-password", data);
};

const resendVerificationEmail = async () => {
    await request().get("sanctum/csrf-cookie");
    return await request().post("/email/verification-notification");
};

export default {
    login,
    logout,
    getUser,
    register,
    forgotPassword,
    resetPassword,
    resendVerificationEmail
};
