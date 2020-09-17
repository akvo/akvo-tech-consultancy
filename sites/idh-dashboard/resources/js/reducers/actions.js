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
