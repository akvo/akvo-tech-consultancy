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
            init: ({filters}) =>
                dispatch({
                    type: "PAGE - INIT PAGE",
                    filters: filters,
                }),
            change: (page, country=false) =>
                dispatch({
                    type: "PAGE - CHANGE PAGE",
                    page: page,
                    country: country
                }),
            create: (page, name) =>
                dispatch({
                    type: "PAGE - CREATE PAGE",
                    page: page,
                    name: name
                }),
            refresh: () =>
                dispatch({
                    type: "PAGE - REFRESH",
                }),
            compare: {
                additem: (id) =>
                    dispatch({
                        type:"PAGE - COMPARE ADD ITEM",
                        id: id,
                    }),
                removeitem: (id) =>
                    dispatch({
                        type:"PAGE - COMPARE REMOVE ITEM",
                        id: id,
                    })
            }

        },
        chart: {
            append: (page, options) =>
                dispatch({
                    type: "CHART - APPEND",
                    page: page,
                    options: options
                }),
        },
    };
};
