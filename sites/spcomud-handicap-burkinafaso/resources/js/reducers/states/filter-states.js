import { faFileContract } from "@fortawesome/free-solid-svg-icons"

export const filterState = {
    overviews:{
        source: null,
        locations: [],
        config: {},
        data: [],
    },
}

export const initFilter = (base, state, page) => {
    return {
        source: state.source,
        config: state.config,
        data: base.data,
    }
}

export const changeFilter = (base, state, page, filter) => {
    if (page === "overviews") {
        let results = {
            ...state,
            overviews : {
                ...state.overviews,
                source: filter.source,
                config: filter.config,
                data: filter.data,
            },
        }
        return results;
    }
}
