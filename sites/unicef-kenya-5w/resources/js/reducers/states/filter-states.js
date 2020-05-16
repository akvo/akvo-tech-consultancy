export const filterState = {
    filter: [{
        id: 1,
        name: 'Loading...',
        parent_id: null,
        values: [],
    }],
    filters: [
    ],
    location: [{
        id: 1,
        name: 'Loading...',
        parent_id: null,
        values: [],
    }],
    active: false,
    locations: [{
        id: 1,
        name: 'Loading...',
        code: 'Loading...',
    }],
}

export const showFilters = (state, data) => {
    return {
        ...state,
        list: [data]
    }
}

export const updateSelectedFilters = (state, id, parent_id, name, depth) => {
    let selected = state.selected;
    let x = depth;
    selected[depth] = {
        id: id,
        parent_id: parent_id,
        name: name
    };
    while (x < 1) {
        let check = depth < x ? true : false;
        if (check) {
            id = selected[x - 1].id;
            let next_selected = state.list[x - 1].find((data) => data.id === id).childs[0];
            selected[x] = {
                id: next_selected.id,
                parent_id: next_selected.parent_id,
                name: next_selected.name,
            }
        }
        x++;
    }
    let newdata = {
        ...state,
        selected: selected,
    }
    return newdata;
}

export const appendFilters = (state, data, depth) => {
    let appends = [];
    let len = state.list.length - 1;
    let i = 0
    if (state.list.length === 2) {
        appends = false
    }
    let newdata = {
        ...state,
        depth: 3
    }
    if (appends) {
        while (i <= len) {
            let current = state.list[i];
            appends = [...appends, current]
            i++;
        }
        newdata = {
            ...state,
            depth: state.list.length + 1,
            list: [...appends, data]
        }
    }
    if (appends === false) {
        let finalFilter = state.list;
        finalFilter[depth + 1] = data;
        newdata = {
            ...state,
            list: finalFilter,
        }
    }
    return newdata;
}
