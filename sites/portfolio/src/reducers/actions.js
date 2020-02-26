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
        setFilters: (name, filter) =>
            dispatch({
                type: "STORE FILTERS",
                name: name,
                filter: filter
            }),
        getFilteredList: () =>
            dispatch({
                type: "SET FILTERS"
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
            })
    };
};
