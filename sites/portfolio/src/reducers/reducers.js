const initialState = {
    page: 'home',
    portfolio: [{
        id: 1,
        title: "Loading...",
        project: "Loading...",
		description: ["Loading..."],
		objective: ["Loading..."],
		category: "Loading...",
        link: "",
        galleries: [
            "portfolio-placeholder.gif",
        ],
		stacks: [],
		partners: [],
		countries: [],
        active: false
    }],
    poc: [{
        id: 1,
        title: "Loading...",
        project: "Loading...",
		description: ["Loading..."],
		objective: ["Loading..."],
		category: "Loading...",
        link: "",
        galleries: [
            "portfolio-placeholder.gif",
        ],
		stacks: [],
		partners: [],
		countries: [],
        active: false
    }],
    partners: [{
        id: 1,
        name: "Loading...",
		description: "Loading...",
		countries: [],
    }],
    countries: [{
        id: 1,
        name: "Loading...",
        code: "Loading...",
    }]
}

const getList= (list) => {
    return list.map((data) => ({
            ...data,
            active: false
        }
    ));
}

const showSubPage = (list, id) => {
    let update = list.map((data) => {
        return {
            ...data,
            active: data.id === id ? true : false
        }
    })
    return update;
}

export const states = (state = initialState, action) => {
    switch(action.type){
        case 'GET PORTFOLIO':
            return {
                ...state,
                portfolio: getList(action.data)
            }
        case 'GET POC':
            return {
                ...state,
                poc: getList(action.data)
            }
        case 'CHANGE PAGE':
            return {
                ...state,
                page: action.page
            }
        case 'SHOW PORTFOLIO':
            return {
                ...state,
                portfolio: showSubPage(state.portfolio, action.id),
                page: 'portfolio'
            }
        case 'SHOW POC':
            return {
                ...state,
                poc: showSubPage(state.poc, action.id),
                page: 'poc'
            }
        case 'HIDE PAGES':
            return {
                ...state,
                page: false
            }
        default:
            return state;
    }
}
