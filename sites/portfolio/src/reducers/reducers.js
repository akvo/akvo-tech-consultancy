const initialState = {
    page: 'home',
    portfolios: [{
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

const getPortfolio = (portfolios) => {
    return portfolios.map((portfolio) => ({
            ...portfolio,
            active: false
        }
    ));
}

const showPortfolio = (portfolios, id) => {
    let update = portfolios.map((portfolio) => {
        return {
            ...portfolio,
            active: portfolio.id === id ? true : false
        }
    })
    return update;
}

export const states = (state = initialState, action) => {
    switch(action.type){
        case 'GET PORTFOLIO':
            return {
                ...state,
                portfolios: getPortfolio(action.data)
            }
        case 'CHANGE PAGE':
            return {
                ...state,
                page: action.data
            }
        case 'SHOW PORTFOLIO':
            return {
                ...state,
                portfolio: showPortfolio(state.portfolios, action.id)
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
