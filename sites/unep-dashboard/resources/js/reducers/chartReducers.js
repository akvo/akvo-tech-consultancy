const initialState = {
    data: [
        {
            id: 1,
            values: [{ code: "Loading", name: "Loading", value: 0 }]
        }
    ],
    active: 1,
    options: []
};

const storeValues = (data, { id, values }) => {
    console.log(values);
    let newdata = { id: id, values: values };
    console.log(newdata);
    return [...data, newdata];
};

const storeOptions = (options, id, option) => {
    return [...options, { id: id, option: option }];
};

export const charts = (state = initialState, action) => {
    switch (action.type) {
        case "STORE VALUES":
            return {
                ...state,
                data: storeValues(state.data, action),
                active: action.id
            };
        case "CHANGE VALUES":
            return {
                ...state,
                data: changeValues(action.id)
            };
        case "STORE OPTIONS":
            return {
                ...state,
                options: storeOptions(state.options, action.id, action.option)
            };
        default:
            return state;
    }
};
