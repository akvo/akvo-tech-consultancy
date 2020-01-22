export const mapStateToProps = (state) => {
    return {
        value: state
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        getPortfolio: (data) => dispatch({
            type: "GET PORTFOLIO",
            data: data
        }),
        showPortfolio: (id) => dispatch({
            type: "SHOW PORTFOLIO",
            id: id
        }),
        hidePage: (data) => dispatch({
            type: "HIDE PAGES",
            data: data
        }),
        changePage: (data) => dispatch({
            type: "CHANGE PAGE",
            data: data
        })
    }
}
