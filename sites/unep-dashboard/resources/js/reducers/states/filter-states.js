export const filterState = {
    list: [[
        {
            name:'loading',
            code:'loading',
            id:1,
            values:[{ id: 1, name: "Loading", value: 0 }]
        }
    ]],
    depth: 1,
    selected: [{
        id: 1,
        name: 'Select Programs',
        values:[{ id: 1, name: "Loading", value: 0 }]
    }],
    active: false,
    countries: [{
        name: 'Select Country',
        code: 'Loading',
        id: 1,
    }],
    country: 'Select Country',
}

export const showFilters = (state, data) => {
    return {
        ...state,
        list: [data]
    }
}

export const updateSelectedFilters = (state, name, id, depth) => {
    let selected = state.selected;
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
            let next_selected = state.list[x - 1].find((data) => data.id === id).childs[0];
            selected[x] = {
                id: next_selected.id,
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
    if (state.list.length === 3) {
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
