export const mapStateToProps = (state) => {
    return {
        value: state
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        getList: (data, list) => dispatch({
            type: "GET " + list,
            data: data
        }),
        showSubPage: (id, page) => dispatch({
            type: "SHOW " + page,
            id: id
        }),
        hidePage: (data) => dispatch({
            type: "HIDE PAGES",
            data: data
        }),
        changePage: (page) => dispatch({
            type: "CHANGE PAGE",
            page: page
        })
    }
}
