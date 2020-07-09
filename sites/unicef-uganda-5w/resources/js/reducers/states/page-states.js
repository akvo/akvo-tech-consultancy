export const pageState = {
    name: "overviews",
    loading: true
}

export const showPage = (state, page) => {
    return {
        ...state,
        name: page
    }
}
