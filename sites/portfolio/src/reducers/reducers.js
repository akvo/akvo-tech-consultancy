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
            active: true,
            show: false
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
            active: true,
            show: false
        }
    ],
    categories:[],
    countries:[],
    selected:{
        countries:[],
        categories:[],
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
        active: true,
        show: false
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

const filterList = (state, selected, filter, adding) => {
    let empty = false;
    let selectedFilters = [];
    for (let selection in selected) {
        for (let sdata of selected[selection]) {
            selectedFilters = [...selectedFilters, sdata]
        }
    }
    if (selectedFilters.length === 0) {
        empty = true;
    }
    let newList = state.map((data) => {
        let active = false;
        let shouldMatchBoth = true;
        let filterLength = {
            countries: {empty: false, count:0},
            categories: {empty: false, count: 0}
        };
        for (let selection in selected) {
            if (selected[selection].length === 0) {
                filterLength[selection].empty = true;
            }
            for (let fdata of data[selection]) {
                if (selected[selection].includes(fdata)) {
                    filterLength[selection].count += 1;
                }
            }
        }
        if (!filterLength.countries.empty) {
            active = false;
            if (filterLength.countries.count > 0) {
                active = true;
            }
            if (!filterLength.categories.empty && filterLength.categories.count === 0) {
                active = false;
            }
        }
        if (filterLength.countries.empty) {
            active = true;
            if (!filterLength.categories.empty && filterLength.categories.count === 0) {
                active = false;
            }
        }
        console.log(filterLength);
        if (empty) {
            active = true;
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
            show: data.id === id ? true : false
        };
    });
    return update;
};

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
        case "SET CATEGORIES":
            return {
                ...state,
                categories: setCategories(state.categories, action.data, "TYPES"),
            }
        case "SET COUNTRIES":
            return {
                ...state,
                countries: setCategories(state.countries, action.data, "COUNTRIES"),
            }
        case "STORE FILTERS":
            return {
                ...state,
                selected: {
                    ...state.selected,
                    [action.filter]:action.data
                }
            }
        case "SET FILTERS":
            return {
                ...state,
                poc: filterList(state.poc, state.selected, action.filter, action.adding),
                portfolio: filterList(state.portfolio, state.selected, action.filter, action.adding),
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
