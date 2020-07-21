export const filterState = {
    list: [[
        {
            name:'loading',
            code:'loading',
            id:1,
            parent_id: 0,
            values:[{ id: 1, name: "Loading", value: 0 }],
            disabled: true,
            childs: [{
                name:'loading',
                code:'loading',
                id:1,
                parent_id: 0,
                values:[{ id: 1, name: "Loading", value: 0 }],
                disabled: true,
            }],
        }
    ]],
    childs: [
        {
            id: 2,
            name:'loading',
            code:'loading',
            parent_id: 1,
            values:[{ id: 1, name: "Loading", value: 0 }],
            disabled: true,
        }
    ],
    depth: 1,
    selected: [{
        id: 1,
        name: 'Select Programs',
        parent_id: 0,
        values:[{ id: 1, name: "Loading", value: 0 }]
    }],
    active: false,
    countries: [{
        name: 'World Wide',
        code: 'Loading',
        id: 1,
    }],
    country: 'World Wide',
    reducer:{
        show:false,
        list: [[
            {
                name:'loading',
                code:'loading',
                id:1,
                parent_id: 0,
                values:[{ id: 1, name: "Loading", value: 0 }],
                disabled: true,
            }
        ]],
        depth: 1,
        selected: [{
            id: 1,
            name: 'Select Filter',
            parent_id: 0,
            values:[{ id: 1, name: "Loading", value: 0 }]
        }],
        ids:[/*{id:1, parent_id:0}*/],
    },
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
        id:id,
        parent_id: parent_id,
        name:name
    };
    while(x < 1){
        let check = depth < x ? true : false;
        if (check){
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
    if (state.list.length !== 1) {
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

/* TODO: Confirm to Joy */
const getParentList = (state, ids) => {
    let parent_ids = ids.map(x => x.parent_id);
    return state.list[0].filter(x =>
        !parent_ids.includes(x.id) || x.id !== state.selected[0].id
    );
}

/* TODO: Confirm to Joy */
const replaceParentData = (state, ids, parent_id) => {
    let selected = state.selected;
    let list = state.list;
    if (selected[0].id === parent_id) {
        let listed_id = ids.map(x => x.id);
        list = [list[0], list[1].filter(x => listed_id.includes(x.id))];
        selected = [selected[0], list[1][0]];
    }
    return {
        selected: selected,
        list: list,
    }
}

export const removeReducer = (state, id, parent_id) => {
    let ids = state.reducer.ids.filter(x => x.id !== id);
    return{
        ...state,
        reducer: {
            ...state.reducer,
            depth:1,
            list: [getParentList(state, ids)],
            selected: [{
                id: 1,
                name: 'Select Filter',
                parent_id: 0,
                values:[{ id: 1, name: "Loading", value: 0 }]
            }],
            ids: ids
        }
    }
}

export const addReducer = (state, id, parent_id) => {
    let ids = [...state.reducer.ids, {id:id, parent_id:parent_id}];
    console.log(getParentList(state, ids));
    return {
        ...state,
        reducer: {
            ...state.reducer,
            depth:1,
            list: [getParentList(state, ids)],
            selected: [{
                id: 1,
                name: 'Select Filter',
                parent_id: 0,
                values:[{ id: 1, name: "Loading", value: 0 }]
            }],
            ids: ids
        }
    }
}
