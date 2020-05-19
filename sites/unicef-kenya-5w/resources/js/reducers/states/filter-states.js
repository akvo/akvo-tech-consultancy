export const filterState = {
    list: [{
        id: 1,
        name: 'Loading...',
        parent_id: null,
        values: [],
        donors: [],
        organisations: [],
        implementing: [],
        locations: [],
    },{
        id: 2,
        name: 'Loading...',
        parent_id: 1,
        values: [],
        donors: [],
        organisations: [],
        implementing: [],
        locations: [],
    }],
    location_values: [{
        id: 1,
        name: 'KENYA',
        values: [],
    }],
    locations: [{
        id: 1,
        name: 'All Counties',
        code: 'KENYA',
    }],
    selected: {
        location: 1,
        filter: 2,
    }
}

export const updateSelectedFilters = (state, id) => {
    return {
        ...state,
    };
}

export const changeFilters = (state, id, depth) => {
    if (depth === 1) {
        let childs = state.filter(x => x.parent_id === id);
        id = childs[0].id;
    }
    return id;
}
