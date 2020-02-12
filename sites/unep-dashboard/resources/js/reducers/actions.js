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
                init: filters =>
                    dispatch({
                        type: "FILTERS - PROGRAM INIT",
                        filters: filters
                    }),
                append: (filters, depth) =>
                    dispatch({
                        type: "FILTERS - PROGRAM APPEND",
                        filters: filters,
                        depth: depth
                    }),
                update: (id, name, depth) =>
                    dispatch({
                        type: "FILTERS - PROGRAM SELECT",
                        id: id,
                        name: name,
                        depth: depth
                    }),
                change: filters =>
                    dispatch({
                        type: "FILTERS - PROGRAM CHANGE",
                        filters: filters
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
            values: {
                store: (id, values) =>
                    dispatch({
                        type: "CHART - STORE VALUES",
                        id: id,
                        values: values
                    }),
                change: id =>
                    dispatch({
                        type: "CHART - CHANGE VALUES",
                        id: id
                    })
            },
            options: {
                store: (id, option) =>
                    dispatch({
                        type: "CHART - STORE OPTIONS",
                        option: option,
                        id: id
                    })
            }
        }
    };
};
