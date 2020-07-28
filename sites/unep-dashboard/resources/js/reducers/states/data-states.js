export const dataState = {
    master: [
        {
            id: 1,
            parent_id: 0,
            name: "Loading",
            code: "Loading",
            units: "Loading",
            parent_id: 1,
            value: 1,
            description: "",
            values: [{ id:1, code: "Loading", name: "Loading", value: 0 }]
        }
    ],
    filters: {
        selected: [],
        all: false,
    },
    countries: {
        selected: [],
        all: false,
    },
    data: [{
        id: 1,
        parent_id: null,
        code: "Loading",
        name: "Loading",
        childrens: []
    }],
};

export const toggleFilter = (state, id) => {
    let active = state.selected;
    let selected = [];
    if (active.includes(id)){
        selected = active.filter(x => x !== id);
    } else {
        selected = [...active, id]
    }
    return selected;
}
