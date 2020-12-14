import request from "../lib/request";

const sendEmail = async data => {
    return await request().post("/api/send-email", data);
};

const informUser = async data => {
    return await request().post("/api/inform-user", data);
};

export default {
    informUser,
    sendEmail,
};
