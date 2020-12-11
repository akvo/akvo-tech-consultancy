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
            init: base =>
                dispatch({
                    type: "FILTER - INIT",
                    base: base
                }),
            change: (selected, page)=>
                dispatch({
                    type: "FILTER - CHANGE",
                    selected: selected,
                    page: page,
                }),
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
                append: (id, page, option) =>
                    dispatch({
                        type: "CHART - OPTIONS APPEND",
                        option: option,
                        id: id,
                        page: page
                    })
            },
            state: {
                loading : (status) =>
                    dispatch({
                        type: "CHART - LOADING",
                        loading: status
                    }),
                filtered: () =>
                    dispatch({
                        type: "CHART - STATE CHANGE",
                    }),
            },
            covid: {
                init : (data) =>
                    dispatch({
                        type: "CHART - COVID INIT",
                        data: data
                    }),
            },
        },
        cache: {
            restore: (data) => {
                dispatch({
                    type: "CACHE - RESTORE",
                    data: data
                });
            }
        },
        modal: {
            toggle: (status, modalKey) => {
                dispatch({
                    type: "TOGGLE - MODAL",
                    status: status,
                    modalKey: modalKey
                })
            }
        }
    };
};
