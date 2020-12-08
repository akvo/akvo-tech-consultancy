import { faFileContract } from "@fortawesome/free-solid-svg-icons"

export const filterState = {
    overviews:{
        source: null,
        locations: [],
        config: {},
        data: [],
        dataLoc: [],
    },
}

export const initFilter = (base, state, page) => {
    return {
        source: state.source,
        config: state.config,
        data: state.data,
        locations: state.locations,
        dataLoc: state.dataLoc,
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
                locations: filter.locations,
                dataLoc: filte.dataLoc,
            },
        }
        return results;
    }
}
