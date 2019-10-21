import axios from 'axios';

export const API_REQUEST_SUCCESS = 'answer:updateAnswer';
export const API_REQUEST_ERROR = 'answer:showError';
export const API_REQUEST_REQUEST = 'answer:loadAnswerApi';

export function updateAnswer(newAnswer) {
    return {
        type: API_REQUEST_SUCCESS,
        payload: {
            answer: newAnswer
        }
    }
}

export function showError() {
    return {
        type: API_REQUEST_ERROR,
        payload: {
            answer: '!!ERROR'
        }
    }
}

export function loadAnswerApi() {
    return {
        type: API_REQUEST_REQUEST,
        payload: {
            answer: 'Requesting Api'
        }
    }
}

export function getAnswer() {
    return dispatch => {
        dispatch(loadAnswerApi());
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then((x) => {
                const name = x.data[1].name;
                dispatch(updateAnswer(name))
            })
            .catch((x) => {
                dispatch(showError())
            })
            .finally(() => {
                console.log()
            })
    }
}

