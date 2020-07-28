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
            init: (filters, countries) =>
                dispatch({
                    type: "PAGE - INIT PAGE",
                    filters: filters,
                    countries: countries
                }),
            change: page =>
                dispatch({
                    type: "PAGE - CHANGE PAGE",
                    page: page
                }),
            sidebar: {
                toggle: () =>
                    dispatch({
                        type: "PAGE - SIDEBAR TOGGLE",
                    })
            }
        },
        data: {
            toggle: {
                filters: (id) =>
                    dispatch({
                        type: "DATA - TOGGLE FILTER",
                        id: id
                    }),
                countries: (id) =>
                    dispatch({
                        type: "DATA - TOGGLE COUNTRY",
                        id: id
                    }),
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
