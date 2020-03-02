export const chartState = {
    data: [
        {
            id: 1,
            name: "",
            units: "",
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
        name: "",
        units: "",
        description: "Loading",
        values: [{ id:1, code: "", name: "Loading", value: 0}]
    }
};

export const appendData = (state, data) => {
    return {
        ...state,
        data: [...state.data, data]
    };
};

export const appendOption = (state, id, option) => {
    return {
        ...state,
        options: [...state.option, { id: id, option: option }]
    };
};

export const filterCharts = (state, data) => {
    console.log(data);
    return {
        ...state,
        active: {
            ...state.active,
            values: data,
        }
    }
}

export const selectCharts = (state, id) => {
    let data = state.data.find(x => x.id === id);
    return {
        ...state,
        active: data,
        loading:false
    }
};
