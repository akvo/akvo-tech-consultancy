const initialState = {
    page: 'index',
    portfolios: [{
        id: 1,
        title: "Loading...",
        project: "Loading...",
		description: ["Loading..."],
		objective: ["Loading..."],
		category: "Loading...",
        galleries: [
            "portfolio-placeholder.gif",
        ],
		stacks: [],
		partners: [],
		countries: [],
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

const getPortfolio = (data) => {
    return data
}

export const states = (state = initialState, action) => {
    switch(action.type){
        case 'GET PORTFOLIO':
            return {
                ...state,
                portfolios: getPortfolio(action.data)
            }
        default:
            return state;
    }
}
