export const chartState = {
    data: [
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
    loading: true,
    options: [
        {
            id: 1,
            options: []
        }
    ],
    filtered: false,
    active: {
        id: 1,
        parent_id: 0,
        name: "Loading",
        code: "Loading",
        units: "Loading",
        parent_id: 1,
        value: 1,
        description: "",
        values: [{ id:1, code: "", name: "Loading", value: 0}]
    },
    reverse: {
        id: 1,
        parent_id: 0,
        name: "Loading",
        code: "Loading",
        units: "Loading",
        parent_id: 1,
        value: 1,
        description: "",
        values: [{ id:1, code: "", name: "Loading", value: 0}]
    },
    loadingState: {
        id: 1,
        parent_id: 0,
        name: "Loading",
        code: "Loading",
        units: "Loading",
        parent_id: 1,
        value: 1,
        description: "",
        values: [{ id:1, code: "", name: "Loading", value: 0}]
    }
};

export const appendData = (state, data) => {
    return {
        ...state,
        data: [...state.data, data],
        loading: false
    };
};

export const appendOption = (state, id, option) => {
    return {
        ...state,
        options: [...state.option, { id: id, option: option }]
    };
};

export const filterCharts = (state, data) => {
    return {
        ...state,
        active: {
            ...state.active,
            values: data,
        },
        loading: false
    }
}

export const reverseCharts = (state) => {
    return {
        ...state,
        active: state.reverse,
        loading: false
    }
}

export const selectCharts = (state, id) => {
    let data = state.data.find(x => x.id === id);
    return {
        ...state,
        active: data,
        reverse: data,
        loading: false
    }
};
