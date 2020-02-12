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
    filterSelected: [{
        id: 1,
        name: 'Select Programs'
    }],
    filterActive: false,
    countries: [{
        name: 'Select Country',
        code: 'Loading',
        id: 1,
    }],
    countrySelected: 'Select Country',
}

const showSection = (state, page) => {
    return {
        ...state,
        active: page
    }
}

const updateSelectedFilters = (state, name, id, depth) => {
    let selected = state.filterSelected;
    let x = depth;
    selected[depth] = {
        id:id,
        name:name
    };
    while(x < 3){
        let check = depth < x ? true : false;
        // console.log('x',x, 'depth', depth, 'check', check);
        if (check){
            id = selected[x - 1].id;
            let next_selected = state.filters[x - 1].find((data) => data.id === id).childs[0];
            console.log(next_selected);
            selected[x] = {
                id: next_selected.id,
                name: next_selected.name,
            }
        }
        x++;
    }
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
            return updateSelectedFilters(state, action.name, action.id, action.depth)
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
