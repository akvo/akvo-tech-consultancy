import 'dotenv/config'
import axios from 'axios';

export const FlowParams = {
    url: () => {
        return process.env.AKVO_FLOW_API;
    },
    headers: (token) => {
        return {
            'headers' : {
                'Content-Type' : 'application/json',
                'Accept' : 'application/vnd.akvo.flow.v2+json',
                'Authorization' : 'Bearer ' + token
            }
        };
    },
};

export const getFlow = async (instance, path, token) => {
    const endpoint = FlowParams.url + '/' + path;
    const headers = FlowParams.headers(token);
    return await axios.get(endpoint, headers);
};
