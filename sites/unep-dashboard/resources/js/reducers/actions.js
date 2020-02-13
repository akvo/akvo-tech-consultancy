export const mapStateToProps = state => {
    return {
        value: state
    };
};

export const mapDispatchToProps = dispatch => {
    return {
        page: {
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
                append: (list, depth) =>
                    dispatch({
                        type: "FILTERS - PROGRAM APPEND",
                        list: list,
                        depth: depth
                    }),
                update: (id, name, depth) =>
                    dispatch({
                        type: "FILTERS - PROGRAM SELECT",
                        id: id,
                        name: name,
                        depth: depth
                    }),
                change: list =>
                    dispatch({
                        type: "FILTERS - PROGRAM CHANGE",
                        list: list
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
                    })
            },
            option: {
                append: (id, option) =>
                    dispatch({
                        type: "CHART - OPTIONS APPEND",
                        option: option,
                        id: id
                    })
            }
        }
    };
};
