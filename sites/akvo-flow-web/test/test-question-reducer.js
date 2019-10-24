const redux = require('redux');
const axios = require('axios');
const createStore = redux.createStore;

const initialState = {
    questions: [],
    answers: [],
    submit: false
}

const addQuestions = (data) => {
    let questionGroup = data['questionGroup'].map(x => x.question);
    return [].concat(...questionGroup);
}

const cleanAnswers = (data) => {
    let questionGroup = data['questionGroup'].map(x => x.question);
    let questions = [].concat(...questionGroup);
    return [].concat(...questions.map(x => {
        return {id: x.id, answer: null};
    }));
}

const replaceAnswers = (current, data) => {
    return current.map(q => data.find(a => a.id === q.id) || q);
}

const checkSubmission = (current) => {
    let total_mandatory = current.questions.filter(q => q.mandatory === true).length;
    console.log('mandatory: ',total_mandatory)
    let total_answered = current.answers.filter(q => q.answer !== null).length;
    console.log('answered: ',total_answered)
    return (total_answered >= total_mandatory ? true : false)
}

const questionReducer = (state = initialState, action) => {
    switch(action.type){
        case 'UPDATE QUESTION':
            return {
                ...state,
                questions: addQuestions(action.data),
                answers: cleanAnswers(action.data)
            }
        case 'CHANGE ANSWERS':
            return {
                ...state,
                answers: replaceAnswers(state.answers, action.data),
            }
        case 'CHECK SUBMISSION':
            return {
                ...state,
                submit: checkSubmission(state),
            }
        default:
            return state;
    }
}

// Store
const store = createStore(questionReducer);
console.log(store.getState());

// Subscription
store.subscribe(() => {
    current = store.getState();
    console.log('submit: ', current.submit);
})

// Dispatch Action
axios.get('http://localhost:5000/dev3/231900002/fetch').then(res => {
    store.dispatch({type: 'UPDATE QUESTION', data: res.data})

    let changeto = [
            { id: '235860001', answer: "mantap" },
            { id: '199920001', answer: "mantap" },
            { id: '221870003', answer: "mantap" },
            { id: '221870016', answer: "mantap" },
            { id: '217900012', answer: "mantap" },
            { id: '203910013', answer: "mantap" },
            { id: '217890014', answer: "mantap" },
            { id: '235910010', answer: "mantap" },
            { id: '227930011', answer: "mantap" },
            { id: '209990007', answer: "mantap" },
            { id: '231970019', answer: "mantap" },
    ]

    store.dispatch({type: 'CHANGE ANSWERS', data: changeto})
    store.dispatch({type: 'CHECK SUBMISSION'})
})
