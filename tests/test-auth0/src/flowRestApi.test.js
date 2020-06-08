import axios from 'axios';
import 'dotenv/config';
import { FlowParams, getFlow } from './flowRestApi.js';

jest.mock('axios');

describe('Flow REST API Params', () => {
    test('funciton exists', () => {
        expect(FlowParams).toBeDefined();
    });

    test('variables is set already', () => {
        expect(process.env.AKVO_FLOW_URL).toBeDefined();
    });
});
