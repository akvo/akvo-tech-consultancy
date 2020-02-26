const initialState = {
    page: "home",
    captions: true,
    portfolio: [
        {
            id: 1,
            title: "Loading...",
            project: "Loading...",
            description: ["Loading..."],
            objective: ["Loading..."],
            categories: ["Loading..."],
            link: "",
            galleries: ["portfolio-placeholder.gif"],
            stacks: [],
            partners: [],
            countries: [],
            active: true
        }
    ],
    poc: [
        {
            id: 1,
            title: "Loading...",
            project: "Loading...",
            description: ["Loading..."],
            objective: ["Loading..."],
            categories: ["Loading..."],
            link: "",
            galleries: ["portfolio-placeholder.gif"],
            stacks: [],
            partners: [],
            countries: [],
            active: true
        }
    ],
    categories:["All Types"],
    countries:["All Countries"],
    selected:{
        categories:[],
        countries:[],
    },
    partners: [
        {
            id: 1,
            name: "Loading...",
            description: "Loading...",
            countries: []
        }
    ],
};

const getList = list => {
    return list.map(data => ({
        ...data,
        active: true
    }));
};

const setCategories = (state, list, type) => {
    let data = list.map(data => {
        if (type === "COUNTRIES") {
            return data.countries;
        }
        return data.categories;
    });
    for (let categories of data) {
        for (let category of categories) {
            if (!state.includes(category)){
                state = [
                    ...state,
                    category
                ];
            }
        }
    }
    return state;
}

const filterList = (state, categories, countries) => {
    let active = true;
    let newList = state.map((data) => {
        let activeCountries = data.countries.map(e => {
            if (countries.includes(e)) {
                return true;
            }
            return false;
        });
        let activeCategories = data.categories.map(e => {
            if (categories.includes(e)) {
                return true;
            }
            return false;
        });
        activeCountries = activeCountries.includes(true);
        activeCategories = activeCategories.includes(true);
        console.log(activeCountries, activeCountries)
        if (!activeCategories || !activeCountries){
            active = false;
        }
        return {
            ...data,
            active: active
        }
    });
    return newList;
};

const showSubPage = (list, id) => {
    let update = list.map(data => {
        return {
            ...data,
            active: data.id === id ? true : false
        };
    });
    return update;
};

const storeFilters = (selected, name, filter) => {
    let data = selected[filter];
    if (data.includes(name)){
        data = data.filter(x => x !== name);
    } else {
        data = [...data, name];
    };
    return {
        ...selected,
        [filter]: data
    }
}

export const states = (state = initialState, action) => {
    switch (action.type) {
        case "GET PORTFOLIO":
            return {
                ...state,
                portfolio: getList(action.data)
            };
        case "GET POC":
            return {
                ...state,
                poc: getList(action.data)
            };
        case "CAPTIONS":
            return {
                ...state,
                captions: state.captions ? false : true
            }
        case "SET TYPES":
            return {
                ...state,
                categories: setCategories(state.categories, action.data, "TYPES"),
                selected: {
                    ...state.selected,
                    categories: setCategories(state.categories, action.data, "TYPES")
                }
            }
        case "SET COUNTRIES":
            return {
                ...state,
                countries: setCategories(state.countries, action.data, "COUNTRIES"),
                selected: {
                    ...state.selected,
                    countries: setCategories(state.countries, action.data, "COUNTRIES")
                }
            }
        case "STORE FILTERS":
            return {
                ...state,
                selected: storeFilters(state.selected, action.name, action.filter)
            }
        case "SET FILTERS":
            return {
                ...state,
                portfolio: filterList(state.portfolio, state.selected.categories, state.selected.countries),
                poc: filterList(state.poc, state.selected.categories, state.selected.countries)
            }
        case "CHANGE PAGE":
            return {
                ...state,
                page: action.page
            };
        case "SHOW PORTFOLIO":
            return {
                ...state,
                portfolio: showSubPage(state.portfolio, action.id),
                page: "portfolio"
            };
        case "SHOW POC":
            return {
                ...state,
                poc: showSubPage(state.poc, action.id),
                page: "poc"
            };
        case "HIDE PAGES":
            return {
                ...state,
                page: false
            };
        default:
            return state;
    }
};
