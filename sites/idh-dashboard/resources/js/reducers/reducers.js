const initialState = {
    page: {
        loading: true,
        active: 'home',
        subpage: {
            country: false
        },
        filters: [{
            name: "Loading",
            childrens: [{
                id: 0,
                kind: "Loading"
            }],
        }],
    },
    charts: []
}

export const states = (state = initialState, action) => {
    switch (action.type) {
        case 'PAGE - LOADING PAGE':
            return {
                ...state,
                page: {
                    ...state.page,
                    loading: action.status
                }
            }
        case 'PAGE - CHANGE PAGE':
            return {
                ...state,
                page: {
                    ...state.page,
                    active: action.page,
                    subpage: {
                        ...state.page.subpage,
                        country: action.country
                    }
                }
            }
        case 'PAGE - INIT PAGE':
            return {
                ...state,
                page: {
                    ...state.page,
                    filters:action.filters
                }
            }
        default:
            return state;
    }
}

export const middleware = (store) => (next) => (action) => {
    next(action);
};
