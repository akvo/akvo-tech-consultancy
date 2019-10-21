import axios from 'axios';

export const API_REQUEST_SUCCESS = 'questions:updateQuestions';
export const API_REQUEST_ERROR = 'questions:showError';
export const API_REQUEST_REQUEST = 'questions:loadQuestionsApi';

export function updateQuestions(newQuestion) {
    return {
        type: API_REQUEST_SUCCESS,
        payload: {
            questions: newQuestion
        }
    }
}

export function showError() {
    return {
        type: API_REQUEST_ERROR,
        payload: {
            questions: [{title:'!!ERROR'}]
        }
    }
}

export function loadQuestionsApi() {
    return {
        type: API_REQUEST_REQUEST,
        payload: {
            questions: [{title:'Requesting Api'}]
        }
    }
}

export function getQuestions() {
    return dispatch => {
        dispatch(loadQuestionsApi());
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then((x) => {
                const random = Math.floor(Math.random() * 100) + 1
                const questions = [x.data[random]];
                dispatch(updateQuestions(questions))
            })
            .catch((x) => {
                dispatch(showError())
            })
            .finally(() => {
                console.log()
            })
    }
}

