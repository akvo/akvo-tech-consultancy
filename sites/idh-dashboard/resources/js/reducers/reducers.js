import { flatFilters } from "../data/utils.js";
const initialState = {
    user: {
        id: 0,
        name: false,
        role: false,
        forms: [
            {
                form_id: 1,
                download: 0,
            },
        ],
        login: false,
    },
    page: {
        loading: true,
        active: "home",
        subpage: {
            country: false,
            tab: "overview",
        },
        filters: [
            {
                name: "Loading",
                childrens: [
                    {
                        id: 0,
                        kind: "Loading",
                    },
                ],
            },
        ],
        compare: {
            items: [],
            init: true,
        },
    },
    charts: [],
};

const addComparison = (state, item, id) => {
    let filters = flatFilters(item);
    let newitem = filters.find((x) => x.id === id);
    return [...state, { id: newitem.id, name: newitem.name }];
};

export const states = (state = initialState, action) => {
    switch (action.type) {
        case "PAGE - LOADING PAGE":
            return {
                ...state,
                page: {
                    ...state.page,
                    loading: action.status,
                },
            };
        case "PAGE - CHANGE PAGE":
            return {
                ...state,
                page: {
                    ...state.page,
                    active: action.page,
                    subpage: {
                        ...state.page.subpage,
                        country: action.country,
                    },
                },
            };
        case "PAGE - CHANGE PAGE TAB":
            return {
                ...state,
                page: {
                    ...state.page,
                    subpage: {
                        ...state.page.subpage,
                        tab: action.tab,
                    },
                },
            };
        case "PAGE - INIT PAGE":
            return {
                ...state,
                page: {
                    ...state.page,
                    filters: action.filters,
                },
            };
        case "PAGE - COMPARE ADD ITEM":
            return {
                ...state,
                page: {
                    ...state.page,
                    compare: {
                        items: addComparison(state.page.compare.items, state.page.filters, action.id),
                        init: false,
                    },
                },
            };
        case "PAGE - COMPARE REMOVE ITEM":
            let data = state.page.compare.items;
            let rm = data.find((x) => x.id === action.id);
            data = data.filter((x) => x.id !== rm.id);
            return {
                ...state,
                page: {
                    ...state.page,
                    compare: {
                        items: data,
                        init: data.length > 0 ? false : true,
                    },
                },
            };
        case "USER - LOGIN":
            return {
                ...state,
                user: action.user,
            };
        case "USER - LOGOUT":
            return {
                ...state,
                user: initialState.user,
            };
        default:
            return state;
    }
};

export const middleware = (store) => (next) => (action) => {
    next(action);
};
