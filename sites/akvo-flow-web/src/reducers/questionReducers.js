import { getQuestionType } from '../util/QuestionHandler.js'
import { isJsonString } from '../util/QuestionHandler.js'
import uuid from 'uuid/v4'

const initialState = {
    surveyName: null,
    surveyId:null,
    version:null,
    questions: [{
        group: 1,
        heading: null,
        id: 1,
        localeNameFlag: false,
        mandatory: false ,
        order: 1,
        show: false,
        text: "Loading",
        type: "text",
        validation: false,
    }],
    active: [],
    answers: [],
    mandatory: [],
    submit: false,
    captcha: false,
    datapoint: null,
    datapoints: [],
    uuid: "LOADING",
    groups: {
        list: [{
            index:1,
            heading:"Loading Questions"
        }],
        active: 1,
    },
}

const addQuestions = (data) => {
    const relable = (q,g) => {
        return {
            ...q,
            id: parseInt(q.id),
            order: parseInt(q.order),
            type: getQuestionType(q),
            group: (g.index + 1),
            heading: g.heading,
            validation: (q.validationRule ? q.validationRule : false),
            show: false
        }
    }
    const mapgroup = (q, g) => {
        return q.map(q => relable(q,g))
    }
    let questionGroup = data.questionGroup.map((g,i) => {
        return {
            ...g,
            question: mapgroup(g.question, {heading:g.heading, index: i})
        }
    }).map(g => g.question)
    return [].concat(...questionGroup);
}

const listDatapoints = (data) => {
    return addQuestions(data).filter(x => x.localeNameFlag).map(q => q.id)
}

const listGroups = (data) => {
    const group = data.questionGroup.map((x,i) => {return { index: (i + 1), heading: x.heading}});
    return {
        list: group,
        active: 1
    }
}

const listMandatory = (data) => {
    return addQuestions(data).filter(x => x.mandatory).map(x => x.id);
}

const showHideQuestions = (orig, group) => {
    let active = orig.map(x => {
        let show = true
        let dependent = false
        if(x.dependency) {
            dependent = x.dependency
            show = false
        }
        if(dependent){
            if(localStorage.getItem(dependent.question)){
                let answer = localStorage.getItem(dependent.question)
                if(isJsonString(answer)) {
                    answer = JSON.parse(answer)
                }
                if(answer.indexOf(dependent['answer-value']) > -1 || answer === dependent['answer-value']) {
                    show = true
                }
            }
        }
        if(x.group !== group){
            show = false
        }
        return { ...x, show:show, type: getQuestionType(x)}
    })
    return active;
}

const reduceDataPoint = (state) => {
    return state
}

const replaceAnswers = (questions, data, restore) => {
    const question = questions.map(x => {
        let answer = null
        let stored = false
        if (restore) {
            stored = data.getItem(x.id);
            answer = (stored ? stored : null)
            try {
                answer = JSON.parse(answer)
            } catch (err) {
                console.log("not json")
            }
            answer = (parseInt(answer).isNan ? parseInt(answer) : answer)
        }
        return {
            id: x.id,
            answer: answer,
            mandatory: x.mandatory
        }
    });
    return question;
}

const generateUUID = () => {
    let id = uuid()
    id = id.split('-')
    console.log(id)
    id = id.map(x => {
        return x.substring(0, 4);
    }).slice(0,3);
    return id.join('-');
}

const checkSubmission = (current, questions) => {
    let mandatory = questions.filter(q => q.mandatory)
    let answered = current.filter(q => q.answer !== null);
    answered = answered.map(a => mandatory.find(m => m.id === a.id) || false)
    answered = answered.filter(a => a)
    return (answered.length >= mandatory.length ? false : true)
}

export const questionReducers = (state = initialState, action) => {
    switch(action.type){
        case 'LOAD QUESTIONS':
            return {
                ...state,
                surveyName: action.data.name,
                surveyId: action.data.surveyId,
                version: action.data.version,
                questions: addQuestions(action.data),
                datapoints: listDatapoints(action.data),
                groups: listGroups(action.data),
                mandatory: listMandatory(action.data)
            }
        case 'RESTORE ANSWERS':
            return {
                ...state,
                answers: replaceAnswers(action.data, localStorage, true)
            }
        case 'REDUCE ANSWER':
            return {
                ...state,
                answers: replaceAnswers(state.answers, action.answer, false),
            }
        case 'REDUCE DATAPOINT':
            return {
                ...state,
                datapoint: reduceDataPoint(action.data)
            }
        case 'CHANGE GROUP':
            return {
                ...state,
                questions: showHideQuestions(state.questions, action.group),
                groups: {...state.groups, active: action.group}
            }
        case 'CHECK SUBMISSION':
            return {
                ...state,
                captcha: checkSubmission(state.answers, state.questions)
            }
        case 'SUBMIT STATE':
            return {
                ...state,
                submit: action.data
            }
        case 'GENERATE UUID':
            return {
                ...state,
                uuid: generateUUID(action.data)
            }
        default:
            return state;
    }
}

