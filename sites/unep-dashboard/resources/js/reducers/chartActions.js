export const chartStateToProps = (state) => {
    return {
        chart: state
    }
}

export const chartDispatchToProps = (dispatch) => {
    return {
        storeValues: (id, values) => dispatch({
            type: "STORE VALUES",
            id: id,
            values: values,
        }),
        changeValues: (id) => dispatch({
            type: "CHANGE VALUES",
            id: id
        }),
        storeOptions: (id, option) => dispatch({
            type: "STORE OPTIONS",
            option: option,
            id: id
        })
    }
}
