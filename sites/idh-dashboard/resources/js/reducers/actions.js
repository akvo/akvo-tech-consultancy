export const mapStateToProps = (state) => {
    return {
        value: state,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        page: {
            loading: (status) =>
                dispatch({
                    type: "PAGE - LOADING PAGE",
                    status: status,
                }),
            init: ({ filters }) =>
                dispatch({
                    type: "PAGE - INIT PAGE",
                    filters: filters,
                }),
            compare: {
                additem: (id) =>
                    dispatch({
                        type: "PAGE - COMPARE ADD ITEM",
                        id: id,
                    }),
                removeitem: (id) =>
                    dispatch({
                        type: "PAGE - COMPARE REMOVE ITEM",
                        id: id,
                    }),
                reset: () =>
                    dispatch({
                        type: "PAGE - COMPARE RESET ITEM"
                    })
            },
            scroll: {
                to: (pos) =>
                    dispatch({
                        type: "PAGE - SCROLL",
                        pos: {scrollPos: pos}
                    }),
            }
        },
        user: {
            login: (user) =>
                dispatch({
                    type: "USER - LOGIN",
                    user: user,
                }),
            logout: () =>
                dispatch({
                    type: "USER - LOGOUT",
                }),
        },
        chart: {
            append: (page, options) =>
                dispatch({
                    type: "CHART - APPEND",
                    page: page,
                    options: options,
                }),
        },
    };
};
