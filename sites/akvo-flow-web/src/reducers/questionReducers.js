import { getQuestionType } from '../util/QuestionHandler.js'
import { isJsonString } from '../util/QuestionHandler.js'
import uuid from 'uuid/v4'
import isoLangs from '../util/Languages.js'
import { PARENT_URL } from '../util/Environment.js'

const DOMAIN_ID = localStorage.getItem('_cache') !== null ? localStorage.getItem('_cache') : false;
const DOMAIN = DOMAIN_ID ? document.referrer + '/' + DOMAIN_ID : document.referrer;

const initialState = {
    error: false,
    domain: PARENT_URL ? DOMAIN : window.location.href,
    instanceName:"Loading...",
    instanceId:"Loading...",
    surveyName:"Loading..",
    surveyId:"Loading..",
    version:"Loading..",
    questions: [{
        group: 1,
        groupIndex: true,
        last: true,
        repeat: true,
        heading: null,
        id: "1-0",
        localeNameFlag: false,
        mandatory: false ,
        order: 1,
        show: false,
        text: "Loading",
        type: "text",
        validation: false,
        iteration: 0,
        overview: false,
        altText: [{
            language:"en",
            text:"Loading",
            type:"translation"
        }],
        help: {
            altText:null,
            text:"Loading",
            type: "tip"
        }
    }],
    active: [],
    answers: [],
    mandatory: [],
    overview: false,
    submit: false,
    captcha: false,
    datapoint: null,
    datapoints: [],
    uuid: "LOADING",
    groups: {
        list: [{
            index:1,
            heading:"Loading Questions",
            attributes: {
                answers: 0,
                questions: 0,
                mandatories: 0,
                hiddens: 0,
                badge: "badge-secondary"
            },
            questions: [1],
            repeatable: false,
            repeat:0
        }],
        active: 1,
    },
    pages:{
    },
    savedUrl: false,
    lang: {
        active: ["en"],
        list: [{id:"en",name:"Loading..."}]
    },
    cascade:[]
}

const generateLang = (questions) => {
    let list = ["en"];
    questions = questions.map((x) => {
        let lang = {en:x.text};
        if (x.altText !== undefined) {
            let listLang = Array.isArray(x.altText)
                ? false
                : {[x.altText.language]:x.altText.text}
            if (listLang) {
                if(!list.includes(x.altText.language)){
                    list.push(x.altText.language);
                }
                lang = {...lang,...listLang}
            } else {
                let i = 0;
                do {
                    lang = {
                        ...lang,
                        [x.altText[i].language]:x.altText[i].text
                    }
                    if(!list.includes(x.altText[i].language)){
                        list.push(x.altText[i].language);
                    }
                    i++;
                } while (i < x.altText.length)
            }
        }
        if (x.type === "option") {
            let listOpt = Array.isArray(x.options.option)
                ? x.options.option
                : [x.options.option]
            listOpt = listOpt.map((c, oi) => {
                let langopt = {en:c.text};
                if (c.altText !== undefined) {
                    let listLangOpt = Array.isArray(c.altText)
                        ? false
                        : {[c.altText.language]:c.altText.text}
                    if (listLangOpt) {
                        if(!list.includes(c.altText.language)){
                            list.push(c.altText.language);
                        }
                        langopt = {...langopt,...listLangOpt}
                    } else {
                        let ix = 0;
                        do {
                            langopt = {
                                ...langopt,
                                [c.altText[ix].language]:c.altText[ix].text
                            }
                            if(!list.includes(c.altText[ix].language)){
                                list.push(c.altText[ix].language);
                            }
                            ix++;
                        } while (ix < c.altText.length)
                    }
                }
                return langopt;
            })
            x.options.lang = listOpt;
        }
        x.lang = lang;
        return x;
    });
    list = list.map(x => {
        let langname = isoLangs[x].name + " / " + isoLangs[x].nativeName;
        return {id:x, name:langname};
    });
    return { questions:questions, list:list };
}


const getGroupAttributes = ((group, questions, answers) => {
        questions = questions.filter((x) => {
            return x.group === group.index;
        });
        answers = answers.filter((x) => {
            return x.answer || x.answer === 0;
        });
        let qgroup = questions;
        let hidden_questions = questions.filter((x) => x.dependency);
        questions = questions.filter((x) => {
            let show = true;
            if (x.dependency) {
                let dependency_values = x.dependency["answer-value"].split("|");
                let answer_dependency = localStorage.getItem(x.dependency.question)
                    ? JSON.parse(localStorage.getItem(x.dependency.question))
                    : false;
                answer_dependency = answer_dependency ? answer_dependency.map(x => x.text) : answer_dependency;
                show = answer_dependency
                    ? answer_dependency.some(r=> dependency_values.indexOf(r) >= 0)
                    : false;
            };
            return show;
        });
        answers = answers.filter((x) => {
            return questions.find(q => q.id === x.id);
        });
        let mandatories = answers.filter(x => x.mandatory);
        mandatories = mandatories.length === 0
            ? 0 : (mandatories.length - questions.length) * - 1;
        hidden_questions = hidden_questions.length === 0
            ? 0 : (
                hidden_questions.length > questions.length
                ? (questions.length - hidden_questions.length) * - 1
                : qgroup.length - questions.length
            )

        if (answers.length === 0) {
            mandatories = qgroup.filter(x => x.mandatory).length;
            if (hidden_questions !== 0) {
                mandatories = questions.filter(x => x.mandatory).length;
            }
        }

        let badge = "badge-secondary";
        badge = questions.length >= answers.length ? badge : "badge-success";
        badge = mandatories > 0 ? "badge-red" : "badge-success";

        return {
            answers: answers.length,
            questions: questions.length,
            mandatories: mandatories,
            hiddens: hidden_questions,
            badge:badge
        };
    })

const validateGroup = (data, sumber) => {
    if (Array.isArray(data)) {
        return data;
    }
	let groups = [];
    if (typeof data === "object") {
        let question = Array.isArray(data.question) ? data.question : [data.question];
        groups.push({
            index:0,
            heading:data.heading,
            question:question,
            repeatable: data.repeatable,
            repeat: data.repeatable ? 1 : 0
        });
    }
	return groups;
}

const addQuestions = (data) => {
    const relable = (q, l, g, iq, gi, it) => {
        if (q.dependency) {
            q.dependency = {
                ...q.dependency,
                question: q.dependency.question + '-0'
            }
        }
        return {
            ...q,
            id: q.id.toString() + '-' + it,
            order: parseInt(q.order),
            groupIndex: iq === 0,
            last: iq === l,
            repeat: g.r,
            iteration: it,
            type: getQuestionType(q),
            group: gi,
            heading: g.h,
            validation: (q.validationRule ? q.validationRule : false),
            overview: false,
            show: false
        }
    }
    const mapgroup = (q, g) => {
        q = Array.isArray(q) ? q : [q];
        let l = q.length - 1;
        let gi = g.i + 1;
        return q.map((q,iq) => relable(q,l,g,iq,gi,0));
    }
	const groups = validateGroup(data.questionGroup,'aq');

	let questionGroup = groups.map((g,i) => {
        let question = g.question;
        question = Array.isArray(question) ? question : [question];
        g.question = question;
		return {
			...g,
            question: mapgroup(g.question, {h:g.heading, i: i, r: g.repeatable})
		}
	}).map(g => g.question)

    return [].concat(...questionGroup);
}

const listDatapoints = (data) => {
	const groups = validateGroup(data.questionGroup, 'ld');
    return addQuestions(groups).filter(x => x.localeNameFlag).map(q => q.id)
}

const listGroups = (data, questions, answers) => {
	let groups = validateGroup(data.questionGroup,'lg');
    groups = groups.map((x,i) => {
        let qgroup = questions.filter(q => q.group === i + 1).map(q => q.id);
        return {
            index: (i + 1),
            heading: x.heading,
            attributes: getGroupAttributes(x, questions, answers),
            questions: qgroup,
            repeatable: x.repeatable,
            repeat: x.repeatable ? 1 : 0
        }
    });
    return {
        list: groups,
        active: 1
    }
}

const listMandatory = (data) => {
	let groups = validateGroup(data.questionGroup, 'lm');
    return addQuestions(groups).filter(x => x.mandatory).map(x => x.id);
}

const showHideQuestions = (orig, group) => {
    let updated_answer = []
    let active = orig.map(x => {
        let show = true
        let overview = true
        let dependent = false
        let answer_value;
        let answer;
        if(x.dependency) {
            dependent = x.dependency
            show = false
        }
        if(dependent){
            if (dependent["answer-value"].includes("|") > -1) {
                answer_value = dependent["answer-value"].split("|")
                answer_value = answer_value.map(b => {
                    if (!isNaN(b)){
                        b = parseInt(b);
                    }
                    return b;
                })
            }
            if (localStorage.getItem(dependent.question) !== null) {
                answer = localStorage.getItem(dependent.question);
                if (answer) {
                    answer = JSON.parse(answer);
                    answer = answer.map((val) => {
                        if(typeof val === 'object') {
                            return val['text'];
                        }
                        let parsed = JSON.parse(val);
                        return parsed['text'];
                    });
                }
                if (isJsonString(answer_value)) {
                    answer = JSON.parse(answer_value)
                }
                if (!isNaN(answer_value)) {
                    answer = answer.toString()
                }
                if (answer.filter(a => answer_value.includes(a)).length > 0){
                    show = true
                }
                if (answer === answer_value) {
                    show = true
                }
                if (answer.filter(a => answer_value.includes(a)).length === 0){
                    //localStorage.removeItem(x.id);
                    show = false
                }
            }
            if (localStorage.getItem(dependent.question) === null) {
                show = false
                localStorage.removeItem(x.id);
            }
        }
        if (group) {
            if(dependent && answer){
                answer_value = dependent["answer-value"].split("|");
                answer_value.forEach((a, i) => {
                    if(answer.includes(a)){
                        show = true;
                    }
                });
                if (answer === answer_value) {
                    show = true
                }
            }
            overview = show
            if(x.group !== group){
                show = false
            }
        }
        if (!group && !show) {
            if (!dependent) {
                localStorage.removeItem(x.id)
            }
            if (dependent) {
                let current_state = updated_answer.find(u => {
                    return u.id === dependent.question
                });
                if (typeof current_state === undefined) {
                    show = false
                }
                if (current_state) {
                    show = current_state.show
                }
            }
        }
        updated_answer.push({...x, show:show, type: getQuestionType(x)})
        return { ...x, show:show, overview: overview, type: getQuestionType(x)}
    });
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
            } catch (err) { }
        }
        return {
            id: x.id,
            answer: answer,
            mandatory: x.mandatory
        }
    });
    return question;
}

const replaceGroups = (groups, questions, answers) => {
    return groups.map(x => {
        let attributes = getGroupAttributes(x, questions, answers);
        return {...x, attributes: attributes}
    });
}

const generateUUID = () => {
    let id = uuid()
    id = id.split('-')
    id = id.map(x => {
        return x.substring(0, 4);
    }).slice(0,3);
    return id.join('-');
}

const getValidAnswers = (answers, questions) => {
    let i = 0;
    let valid = [];
    let mandatory = answers.filter(x => x.mandatory);
    do {
        let match = false;
        let dependent = false;
        let dependent_value = false;
        let answered = false;
        let q;
        q = questions[i];
        if (q.dependency !== undefined) {
            dependent = q.dependency["answer-value"];
            dependent_value = dependent.split("|");
            answered = localStorage.getItem(q.dependency.question);
            answered = JSON.parse(answered);
        } else {
            valid = [...valid, q];
        }
        if (answered) {
            match = dependent_value.some(opt =>
                answered.find(val => val.text === opt)
            );
        }
        if (match) {
            valid = [...valid, q];
        }
        i++;
    } while(i < questions.length);
    return mandatory.filter(x => valid.find(z => x.id === z.id));
}

const checkSubmission = (answers, questions) => {
    let validAnswers = getValidAnswers(answers, questions);
    let mandatory = validAnswers.filter(x => x.answer === null);
    let captcha = mandatory <= 0;
    return captcha
}

const setupPages = (current, data) => {
    return {
        ...current,
        data
    }
}

const storeCascade = (current, cascade) => {
    if (current.length < 1) {
        return [cascade];
    }
    return [...current, cascade];
}

const cloneQuestions = (questions, groups, group_id, restoring=false) => {
    let group = groups.list.find(x => x.index === group_id);
    let new_questions = questions.filter(x => {
        let id = x.id.split('-')[0] + '-0';
        return group.questions.includes(id);
    });
    let new_iteration = new_questions.slice(-1)[0].iteration + 1;
    /* Should be Unique */
    let qgroup = [];
    let i = 0;
    do {
        let new_id = new_questions[i].id.split('-')[0] + '-' + new_iteration;
        if (new_questions[i].dependency !== undefined) {
            let dependency_question = new_questions[i].dependency.question;
            let dependency_iteration = group.questions.indexOf(dependency_question) === -1 ? '0' : new_iteration;
            new_questions[i] = {
                ...new_questions[i],
                dependency: {
                    ...new_questions[i].dependency,
                    question: new_questions[i].dependency.question.split('-')[0] + '-' + dependency_iteration
                }
            }
        }
        qgroup = [
            ...qgroup,
            {...new_questions[i], id: new_id, iteration: new_iteration}
        ];
        i++;
    } while(i < group.questions.length);
    const all_questions = [...questions, ...qgroup];
    updateLocalStorage(all_questions);

    let newgroup = groups.list.map(g => {
        if (g.index === group_id) {
            g.repeat = g.repeat + 1;
            if (!restoring) {
                localStorage.setItem('G'+group_id,g.repeat);
            }
        }
        return g;
    });
    return {questions: all_questions, groups: {...groups, list: newgroup}};
}

const removeQuestions = (questions, groups, data) => {
    const reduced_questions = questions.filter(x => {
        if (x.group === data.group) {
            return false;
        }
        return true;
    });
    const selected_questions = questions.filter(x => {
        if (x.group === data.group) {
            if (x.iteration === data.iteration) {
                localStorage.removeItem(x.id);
            }
            return x.iteration !== data.iteration;
        }
        return false;
    });
    let new_iterated = selected_questions.reduce(
        (h, obj) => Object.assign(h, { [obj.iteration]:( h[obj.iteration] || [] )
            .concat(obj) }),{}
    );
    let new_questions = [];
    Object.keys(new_iterated).forEach(function(k, ix) {
        new_iterated[k].forEach(q => {
            let answer = localStorage.getItem(q.id);
            let new_id = q.id.split('-')[0] + '-' + ix;
            let qgroup = groups.list.find(qg => qg.index === q.group);
            if (q.dependency !== undefined) {
                let default_dependency = q.dependency.question.split('-')[0] + '-0';
                let dependency_iteration = qgroup.questions.indexOf(default_dependency) === -1
                    ? '0' : ix;
                q = {
                    ...q,
                    dependency: {
                        ...q.dependency,
                        question: q.dependency.question.split('-')[0] + '-' + dependency_iteration
                    }
                }
            }
            new_questions.push({...q, id: new_id, iteration: ix})
            if (q.id !== new_id && answer !== null) {
                localStorage.setItem(new_id, answer);
                localStorage.removeItem(q.id);
            }
        });
    });
    const all_questions = [...reduced_questions, ...new_questions];
    updateLocalStorage(all_questions);

    let newgroup = groups.list.map(g => {
        if (g.index === data.group) {
            g.repeat = g.repeat - 1;
            localStorage.setItem('G'+data.group,g.repeat);
            if (g.repeat === 1) {
                localStorage.removeItem('G'+data.group);
            }
        }
        return g;
    });
    return {questions: all_questions, groups: {...groups, list: newgroup}};
}

const updateLocalStorage = (questions) => {
    localStorage.setItem("questionId", questions.map(x => x.id));
    localStorage.setItem("answerType", questions.map(x => x.type.toUpperCase()));
    return true;
}

export const questionReducers = (state = initialState, action) => {
    switch(action.type){
        case 'LOAD QUESTIONS':
            const questions = addQuestions(action.data);
            const langQuestions = generateLang(questions);
            return {
                ...state,
                instanceName: action.data.instanceName,
                instanceId: action.data.app,
                surveyName: action.data.name,
                surveyId: action.data.surveyId,
                version: action.data.version,
                questions: questions,
                datapoints: listDatapoints(action.data),
                mandatory: listMandatory(action.data),
                lang: {
                    active: state.lang.active,
                    list: langQuestions.list
                }
            }
        case 'LOAD GROUPS':
            return {
                ...state,
                groups: listGroups(action.data, state.questions, state.answers),
            }
        case 'REPLACE ANSWERS':
            return {
                ...state,
                answers: replaceAnswers(action.data, localStorage, true)
            }
        case 'REDUCE GROUPS':
            return {
                ...state,
                groups: {
                    ...state.groups,
                    list: replaceGroups(state.groups.list, state.questions, state.answers)
                }
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
        case 'CLONE GROUP':
            const cloned = cloneQuestions(state.questions, state.groups, action.id, action.restoring);
            return {
                ...state,
                questions: cloned.questions,
                answers: replaceAnswers(cloned.questions, localStorage, true),
                groups: cloned.groups,
            }
        case 'REMOVE GROUP':
            const uncloned = removeQuestions(state.questions, state.groups, action.data);
            return {
                ...state,
                questions: uncloned.questions,
                groups: uncloned.groups
            }
        case 'CHANGE LOCALIZATION':
            return {
                ...state,
                lang : {
                    ...state.lang,
                    active: action.active,
                }
            }
        case 'CHECK SUBMISSION':
            return {
                ...state,
                captcha: checkSubmission(state.answers, state.questions),
                submit: false
            }
        case 'SUBMIT STATE':
            return {
                ...state,
                submit: action.data
            }
        case 'URL STATE':
            return {
                ...state,
                savedUrl: action.show
            }
        case 'GENERATE UUID':
            return {
                ...state,
                uuid: generateUUID(action.data)
            }
        case 'PAGES SETTINGS':
            return {
                ...state,
                pages: setupPages(state.pages, action.data)
            }
        case 'STORE CASCADE':
            return {
                ...state,
                cascade: storeCascade(state.cascade, action.data)
            }
        case 'SHOW OVERVIEW':
            return {
                ...state,
                overview: action.show
            }
        case 'SHOW ERROR':
            return {
                ...state,
                surveyName:"Error",
                surveyId:"Error",
                version:"Error",
                lang: {
                    ...state.lang,
                    list: [{id:"en",name:"Error"}]
                },
                error: true
            }
        case 'STORAGE UPDATE':
            updateLocalStorage(state.questions);
            return {
                ...state,
            }
        case 'UPDATE DOMAIN':
            return {
                ...state,
                domain: action.url
            }
        default:
            return state;
    }
}
