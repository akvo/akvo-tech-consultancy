import {
    API_REQUEST_SUCCESS,
    API_REQUEST_ERROR,
    API_REQUEST_REQUEST
} from '../actions/answerAction.js'

export default function answerReducer(state = '', {
    type,
    payload
}) {
    switch (type) {
        case API_REQUEST_REQUEST:
            return payload.answer;
        case API_REQUEST_SUCCESS:
            return payload.answer;
        case API_REQUEST_ERROR:
            return payload.answer;
        default:
            return state;
    }
}
