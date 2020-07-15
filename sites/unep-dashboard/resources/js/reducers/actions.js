export const mapStateToProps = state => {
    return {
        value: state
    };
};

export const mapDispatchToProps = dispatch => {
    return {
        page: {
            loading: (status) =>
                dispatch({
                    type: "PAGE - LOADING PAGE",
                    status: status
                }),
            change: page =>
                dispatch({
                    type: "PAGE - CHANGE PAGE",
                    page: page
                })
        },
        filter: {
            program: {
                init: list =>
                    dispatch({
                        type: "FILTERS - PROGRAM INIT",
                        list: list
                    }),
                append: (list, depth, kind) =>
                    dispatch({
                        type: "FILTERS - PROGRAM APPEND",
                        list: list,
                        depth: depth,
                        kind: kind
                    }),
                update: (id, parent_id, name, depth, kind) =>
                    dispatch({
                        type: "FILTERS - PROGRAM SELECT",
                        id: id,
                        parent_id: parent_id,
                        name: name,
                        depth: depth,
                        kind: kind
                    }),
                change: list =>
                    dispatch({
                        type: "FILTERS - PROGRAM CHANGE",
                        list: list,
                        kind: kind
                    }),
            },
            reducer: {
                show: () =>
                    dispatch({
                        type: "FILTERS - REDUCER SHOW",
                    }),
                append: (id, parent_id) =>
                    dispatch({
                        type: "FILTERS - REDUCER APPEND",
                        id: id,
                        parent_id: parent_id
                    }),
                remove: (id, parent_id) =>
                    dispatch({
                        type: "FILTERS - REDUCER REMOVE",
                        id: id,
                        parent_id: parent_id,
                    })
            },
            country: {
                init: countries =>
                    dispatch({
                        type: "FILTERS - COUNTRY INIT",
                        countries: countries
                    }),
                change: country =>
                    dispatch({
                        type: "FILTERS - COUNTRY CHANGE",
                        country: country
                    })
            },
        },
        chart: {
            value: {
                append: (values) =>
                    dispatch({
                        type: "CHART - VALUES APPEND",
                        values: values
                    }),
                select: id =>
                    dispatch({
                        type: "CHART - VALUES SELECT",
                        id: id
                    }),
                filter: data =>
                    dispatch({
                        type: "CHART - VALUES FILTER",
                        data: data,
                    }),
                reverse: () =>
                    dispatch({
                        type: "CHART - VALUES REVERSE"
                    })
            },
            option: {
                append: (id, option) =>
                    dispatch({
                        type: "CHART - OPTIONS APPEND",
                        option: option,
                        id: id
                    })
            },
            state: {
                loading : () =>
                    dispatch({
                        type: "CHART - LOADING"
                    }),
                filtered: () =>
                    dispatch({
                        type: "CHART - STATE CHANGE",
                    }),
            }
        }
    };
};
