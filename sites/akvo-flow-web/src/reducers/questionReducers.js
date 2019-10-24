const initialState = {
    questions: [],
    answers: [],
    submit: true
}

const addQuestions = (data) => {
    let questionGroup = data['questionGroup'].map(x => x.question);
    return [].concat(...questionGroup);
}

const cleanAnswers = (data) => {
    let questionGroup = data['questionGroup'].map(x => x.question);
    let questions = [].concat(...questionGroup);
    return [].concat(...questions.map(x => {
        let answer = null;
        if(localStorage.getItem(x.id)){
            answer = localStorage.getItem(x.id)
        }
        return {id: x.id, answer: answer, mandatory: x.mandatory};
    }));
}

const replaceAnswers = (current, data) => {
    let response = current.map(q => data.find(a => a.id === q.id) || q);
    return response
}

const checkSubmission = (current, questions) => {
    let mandatory = questions.filter(q => q.mandatory)
    let answered = current.filter(q => q.answer !== null);
    answered = answered.map(a => mandatory.find(m => m.id === a.id) || false)
    answered = answered.filter(a => a)
    console.log(current)
    return (answered.length >= mandatory.length ? false : true)
}

export const questionReducers = (state = initialState, action) => {
    switch(action.type){
        case 'UPDATE QUESTION':
            return {
                ...state,
                questions: addQuestions(action.data),
                answers: cleanAnswers(action.data)
            }
        case 'REPLACE ANSWER':
            return {
                ...state,
                answers: replaceAnswers(state.answers, action.data),
            }
        case 'CHECK SUBMISSION':
            return {
                ...state,
                submit: checkSubmission(state.answers, state.questions),
            }
        default:
            return state;
    }
}
