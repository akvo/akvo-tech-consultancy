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
            init: ({filters, countries, data, datapoints}) =>
                dispatch({
                    type: "PAGE - INIT PAGE",
                    filters: filters,
                    countries: countries,
                    data: data,
                    datapoints: datapoints
                }),
            change: page =>
                dispatch({
                    type: "PAGE - CHANGE PAGE",
                    page: page
                }),
            sidebar: {
                toggle: (selected) =>
                    dispatch({
                        type: "PAGE - SIDEBAR TOGGLE",
                        selected:selected
                    }),
                switchgroup: () =>
                    dispatch({
                        type: "PAGE - SIDEBAR SWITCH GROUP",
                    }),
            },
            badge: {
                store: (badges) =>
                    dispatch({
                        type:"PAGE - BADGE STORE",
                        badges:badges
                    })
            }
        },
        data: {
            toggle: {
                filters: (id) =>
                    dispatch({
                        type: "DATA - TOGGLE FILTER",
                        id: id,
                    }),
                countries: (data, group) =>
                    dispatch({
                        type: "DATA - TOGGLE COUNTRY",
                        data: data,
                        group: group
                    }),
                global: () =>
                    dispatch({
                        type: "DATA - TOGGLE GLOBAL",
                    }),
            },
            remove: {
                filters: (id, ids) =>
                    dispatch({
                        type: "DATA - REMOVE FILTERS",
                        id: id,
                        ids: ids
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
