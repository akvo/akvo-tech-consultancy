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
    }
}
