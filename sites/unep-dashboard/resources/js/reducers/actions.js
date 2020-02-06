export const mapStateToProps = (state) => {
    return {
        value: state
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        changePage: (page) => dispatch({
            type: "CHANGE PAGE",
            page: page
        }),
        initFilters: (filters) => dispatch({
            type: "INIT FILTERS",
            filters: filters
        }),
        appendFilters: (filters, depth) => dispatch({
            type: "APPEND FILTERS",
            filters: filters,
            depth: depth,
        }),
        updateSelectedFilters: (name, depth) => dispatch({
            type: "SELECT FILTERS",
            name: name,
            depth: depth,
        }),
        changeFilters: (filters) => dispatch({
            type: "CHANGE FILTERS",
            filters: filters
        }),
        initCountries: (countries) => dispatch({
            type: "INIT COUNTRIES",
            countries: countries
        }),
        changeCountry: (country) => dispatch({
            type: "CHANGE COUNTRY",
            country: country
        }),
    }
}
