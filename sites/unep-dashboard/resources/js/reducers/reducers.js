const initialState = {
    active: "home",
    filters: [[
        {
            name:'loading',
            code:'loading',
            id:1
        },
        {
            name:'mantap',
            code:'mantap',
            id:2
        }
    ]],
    filterDepth: 1,
    filterSelected: [],
    countries: [{
        name: 'loading',
        code: 'loading',
        id: 1,
    }],
    countrySelected: 'Select Country',
    active: 'Home'
}

const showSection = (state, page) => {
    return {
        ...state,
        active: page
    }
}

const updateSelectedFilters = (state, name, depth) => {
    let selected = state.filterSelected;
    if (depth + 1 < selected.length){
        let i = selected.length;
        let d = depth + 1;
        while (i > d) {
            selected[d] = state.filters[d][0]['name'];
            d++;
        }
    }
    selected[depth] = name;
    let newdata = {
        ...state,
        filterSelected: selected,
    }
    return newdata;
}

const appendFilters = (state, data, depth) => {
    let appends = [];
    let len = state.filters.length - 1;
    let i = 0
    if (state.filters.length === 3) {
        appends = false
    }
    let newdata = {
        ...state,
        filterDepth: 3
    }
    if (appends) {
        while (i <= len) {
            let current = state.filters[i];
            appends = [...appends, current]
            i++;
        }
        newdata = {
            ...state,
            filterDepth: state.filters.length + 1,
            filters: [...appends, data]
        }
    }
    if (appends === false) {
        let finalFilter = state.filters;
        finalFilter[depth + 1] = data;
        newdata = {
            ...state,
            filters: finalFilter,
        }
    }
    return newdata;
}

const showFilters = (state, data) => {
    return {
        ...state,
        filters: [data]
    }
}

export const states = (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE PAGE':
            return showSection(state, action.page)
        case 'INIT FILTERS':
            return {
                ...state,
                filters: [action.filters]
            }
        case 'APPEND FILTERS':
            return appendFilters(state, action.filters, action.depth)
        case 'SELECT FILTERS':
            return updateSelectedFilters(state, action.name, action.depth)
        case 'CHANGE FILTERS':
            return showFilters(state, action.filters)
        case 'INIT COUNTRIES':
            return {
                ...state,
                countries: action.countries
            }
        case 'CHANGE COUNTRY':
            return {
                ...state,
                countrySelected: action.country
            }
        default:
            return state;
    }
}
