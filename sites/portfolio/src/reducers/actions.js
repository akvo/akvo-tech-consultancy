export const mapStateToProps = state => {
    return {
        value: state
    };
};

export const mapDispatchToProps = dispatch => {
    return {
        getList: (data, list) =>
            dispatch({
                type: "GET " + list,
                data: data
            }),
        captionsToggle: () =>
            dispatch({
                type: "CAPTIONS"
            }),
        showSubPage: (id, page) =>
            dispatch({
                type: "SHOW " + page,
                id: id
            }),
        setCategories: (data, filters) =>
            dispatch({
                type: "SET " + filters,
                data: data
            }),
        setFilters: (data, filter) =>
            dispatch({
                type: "STORE FILTERS",
                data: data,
                filter: filter,
            }),
        getFilteredList: (filter, adding) =>
            dispatch({
                type: "SET FILTERS",
                filter: filter,
                adding: adding
            }),
        hidePage: data =>
            dispatch({
                type: "HIDE PAGES",
                data: data
            }),
        changePage: page =>
            dispatch({
                type: "CHANGE PAGE",
                page: page
            }),
        login: status =>
            dispatch({
                type: "LOGIN",
                status: status
            })
    };
};
