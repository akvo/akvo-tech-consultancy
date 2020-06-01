import axios from 'axios';
import 'dotenv/config';
import { Auth, AuthParams } from './authenticate.js';

jest.mock('axios');
const username = process.env.AUTH0_USER;
const password = process.env.AUTH0_PWD;

describe('Auth Parameters', () => {
    test('function exists', () => {
        expect(AuthParams).toBeDefined();
    });

    test('variables password is set already', () => {
        expect(process.env.AUTH0_PWD).toBeDefined();
        expect(process.env.AUTH0_USER).toBeDefined();
        expect(process.env.AUTH0_URL).toBeDefined();
        expect(process.env.CLIENT_ID).toBeDefined();
    });

	test('parameter is ready', () => {
		expect(AuthParams.add(username, password)).toStrictEqual({
			client_id: process.env.CLIENT_ID,
			username: process.env.AUTH0_USER,
			password: process.env.AUTH0_PWD,
			grant_type: "password",
			scope: "openid email",
		});
	});

});

describe('Auth Request', () => {
    test('function exists', () => {
        expect(Auth).toBeDefined();
    });

    test('Check if it return matches object', async () => {
		const data = AuthParams.add(username, password);
        const response = {
            access_token: "very long string",
            id_token: "very long string",
            scope: "openid email",
            expires_in: 86400,
            token_type: "Bearer",
        }
        axios.post.mockImplementationOnce(() => Promise.resolve(data));
        await expect(Auth(data)).resolves.toMatchObject(data);
    });
});
