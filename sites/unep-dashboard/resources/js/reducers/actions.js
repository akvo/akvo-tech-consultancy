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
            tour: () =>
                dispatch({
                    type: "PAGE - SHOW TOUR",
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
            },
            toggle: {
                keepfilter: () =>
                    dispatch({
                        type:"PAGE - SWITCH KEEP FILTER"
                    }),
                fundcontrib: () =>
                    dispatch({
                        type:"PAGE - SWITCH FUND CONTRIBUTION"
                    })

            },
            compare: {
                additem: (id, itemtype) =>
                    dispatch({
                        type:"PAGE - COMPARE ADD ITEM",
                        id: id,
                        itemtype: itemtype
                    }),
                removeitem: (id, itemtype) =>
                    dispatch({
                        type:"PAGE - COMPARE REMOVE ITEM",
                        id: id,
                        itemtype: itemtype
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
        },
        report: {
            append: (id) =>
                dispatch({
                    type: "REPORT - ADD",
                    id: id
                }),
            delete: (id) =>
                dispatch({
                    type: "REPORT - REMOVE",
                    id: id
                }),
            reset: () =>
                dispatch({
                    type: "REPORT - RESET",
                }),
            appendall: (data) =>
                dispatch({
                    type: "REPORT - ADD ALL",
                    data: data
                }),
            download: (download) =>
                dispatch({
                    type: "REPORT - DOWNLOAD",
                    download: download

                })
        },
        locale: {
            change: (lang) =>
                dispatch({
                    type: "LOCALE - CHANGE",
                    lang: lang
                })
        }
    };
};
