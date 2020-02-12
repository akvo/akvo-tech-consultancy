export const showFilters = (state, data) => {
    return {
        ...state,
        filters: [data]
    }
}

export const updateSelectedFilters = (state, name, id, depth) => {
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

export const appendFilters = (state, data, depth) => {
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
