import { faFileContract } from "@fortawesome/free-solid-svg-icons"

export const filterState = {
    overviews:{
        source: null,
        locations: [],
        config: {
            first_filter: [],
            second_filter: [],
            template: {
                css: null,
                js: null,
            },
            maps: {
                match_question: null,
            },
        },
        data: [],
    },
}

export const initFilter = (base, state, page) => {
    return {
        source: state.source,
        config: state.config,
        data: state.data,
        locations: state.locations,
    }
}

export const changeFilter = (base, state, page, filter) => {
    if (page === "overviews" || page === "webform") {
        let results = {
            ...state,
            overviews : {
                source: filter.source,
                config: filter.config,
                data: filter.data,
                locations: filter.locations,
            },
        }
        return results;
    }
}
