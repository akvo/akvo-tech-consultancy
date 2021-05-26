import request from "../lib/request";

const getActivities = async (data) => {
    return await request().get("/api/submission/activity");
};

export default {
    getActivities,
};
