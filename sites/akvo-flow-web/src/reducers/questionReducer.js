import {
    API_REQUEST_REQUEST,
    API_REQUEST_ERROR,
    API_REQUEST_SUCCESS
} from '../actions/questionAction.js'

export default function questionReducer(state = [{title:'test'}], {
	type,
	payload
}) {
    switch (type){
        case API_REQUEST_REQUEST:
            return payload.questions;
        case API_REQUEST_SUCCESS:
            return payload.questions;
        case API_REQUEST_ERROR:
            return payload.questions;
        default:
            return state;
    }
}
