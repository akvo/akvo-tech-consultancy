import 'dotenv/config'
import axios from 'axios';

export const AuthParams = {
    add: (username, password) => {
		return {
			client_id: process.env.CLIENT_ID,
			username: username,
			password: password,
			grant_type: "password",
			scope: "openid email",
		}
	},
	url: () => {
		return process.env.AUTH0_URL
	}
}

export const Auth = async (data) => {
    return await axios.post(AuthParams.url, data);
};
