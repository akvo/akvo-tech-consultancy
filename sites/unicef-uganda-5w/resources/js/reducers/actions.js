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
            category: {
                init: list =>
                    dispatch({
                        type: "FILTERS - CATEGORY INIT",
                        list: list
                    }),
                change: (id, depth)=>
                    dispatch({
                        type: "FILTERS - CATEGORY CHANGE",
                        id: id,
                        depth: depth
                    })
            },
            location: {
                init: locations =>
                    dispatch({
                        type: "FILTERS - LOCATION INIT",
                        locations: locations
                    }),
                push: data =>
                    dispatch({
                        type: "FILTERS - LOCATION VALUES",
                        data: data
                    }),
                change: id =>
                    dispatch({
                        type: "FILTERS - LOCATION CHANGE",
                        id: id
                    })
            },
            organisation: {
                init: org =>
                    dispatch({
                        type: "FILTERS - ORGANISATION INIT",
                        org : org
                    }),
            },
            valtype: {
                change: valueName =>
                    dispatch({
                        type: "FILTERS - VALUE CHANGE",
                        valueName : valueName
                    }),
            }
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
        },
        cache: {
            restore: (data) => {
                dispatch({
                    type: "CACHE - RESTORE",
                    data: data
                });
            }
        }
    };
};
