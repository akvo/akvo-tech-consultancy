export const pageState = {
    name: "planned",
    loading: true
}

export const showPage = (state, page) => {
    return {
        ...state,
        name: page
    }
}
