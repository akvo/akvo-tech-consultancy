export const pageState = {
}

export const showPage = (state, page) => {
    return {
        ...state,
        pageActive: page
    }
}
