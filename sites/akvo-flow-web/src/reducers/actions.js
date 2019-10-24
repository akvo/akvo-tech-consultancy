export const mapStateToProps = (state) => {
    return {
        value: state
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        questionReducer: (data) => dispatch({type:"UPDATE QUESTION", data:data}),
        answerReducer: (data) => dispatch({type:"REPLACE ANSWER", data:data}),
        checkSubmission: () => dispatch({type:"CHECK SUBMISSION"})
    }
}

