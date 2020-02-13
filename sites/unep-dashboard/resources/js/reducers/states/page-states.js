export const pageState = {
    name: "home"
}

export const showPage = (state, page) => {
    return {
        ...state,
        name: page
    }
}
