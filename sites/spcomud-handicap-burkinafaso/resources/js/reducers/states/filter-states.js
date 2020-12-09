import { faFileContract } from "@fortawesome/free-solid-svg-icons"

export const filterState = {
    overviews:{
        source: null,
        locations: [],
        config: {},
        data: [],
        mapData: [],
        filteredMapData: [],
    },
}

export const initFilter = (base, state, page) => {
    return {
        source: state.source,
        config: state.config,
        data: state.data,
        locations: state.locations,
        mapData: state.mapData,
        filteredMapData: state.filteredMapData,
    }
}

export const changeFilter = (base, state, page, filter) => {
    if (page === "overviews") {
        let results = {
            ...state,
            overviews : {
                // ...state.overviews,
                source: filter.source,
                config: filter.config,
                data: filter.data,
                locations: filter.locations,
                mapData: filter.mapData,
                filteredMapData: filter.filteredMapData
            },
        }
        return results;
    }
}
