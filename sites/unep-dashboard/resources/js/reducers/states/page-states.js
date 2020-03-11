export const pageState = {
    name: "home",
    loading: true
}

export const showPage = (state, page) => {
    return {
        ...state,
        name: page
    }
}
