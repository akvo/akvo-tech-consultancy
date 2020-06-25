import {
    pageState,
    showPage,
} from './states/page-states.js';
import {
    filterState,
    changeFilters,
    getOrganisations,
    populateAll,
    getOverviews
} from './states/filter-states.js';
import {
    chartState,
    appendData,
    appendOption,
    selectCharts,
    filterCharts,
    reverseCharts
} from './states/chart-states.js';

const initialState = {
    page: pageState,
    filters: filterState,
    charts: chartState,

}

export const states = (state = initialState, action) => {
    switch (action.type) {
        case 'PAGE - LOADING PAGE':
            return {
                ...state,
                page: {
                    ...state.page,
                    loading: action.status
                }
            }
        case 'PAGE - CHANGE PAGE':
            return {
                ...state,
                page: showPage(state.page, action.page)
            }
        case 'FILTERS - CATEGORY INIT':
            let childs = action.list.filter(x => x.parent_id !== null);
            // let all = populateAll(action.list);
            // console.log(all);
            return {
                ...state,
                filters: {
                    ...state.filters,
                    list: action.list,
                    selected: {
                        ...state.filters.selected,
                        filter: {
                            domain:childs[0].parent_id,
                            sub_domain:childs[0].id,
                        }
                    }
                }
            }
        case 'FILTERS - CATEGORY CHANGE':
            let currentType = state.filters.selected.type;
            return {
                ...state,
                filters: {
                    ...state.filters,
                    selected: {
                        ...state.filters.selected,
                        filter: changeFilters(state.filters, action.id, action.depth),
                        type: currentType === 'reset' ? 'new' : currentType
                    }
                }
            }
        case 'FILTERS - CATEGORY CLEAR':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    selected: {
                        ...state.filters.selected,
                        filter: {
                            domain:false,
                            sub_domain:false
                        },
                        type: currentType !== 'reset' ? 'reset' : currentType
                    }
                }
            }
        case 'FILTERS - LOCATION INIT':
            return {
                ...state,
                filters : {
                    ...state.filters,
                    locations: [...state.filters.locations, ...action.locations]
                }
            }
        case 'FILTERS - LOCATION VALUES':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    location_values: action.data,
                    overviews: getOverviews(action.data)
                }
            }
        case 'FILTERS - LOCATION CHANGE':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    selected: {
                        ...state.filters.selected,
                        location: action.id
                    }
                }
            }
        case 'FILTERS - VALUE CHANGE':
            return {
                ...state,
                filters:{
                    ...state.filters,
                    selected: {
                        ...state.filters.selected,
                        type: action.valueName
                    }
                }
            }
        case 'FILTERS - ORGANISATION INIT':
            return {
                ...state,
                filters : {
                    ...state.filters,
                    organisations: getOrganisations(action.org),
                    organisation_values: action.org
                }
            }
        case 'CHART - VALUES APPEND':
            return {
                ...state,
                charts: appendData(state.charts, action.values)
            }
        case 'CHART - VALUES SELECT':
            return {
                ...state,
                charts: selectCharts(state.charts, action.id)
            }
        case 'CHART - VALUES FILTER':
            return {
                ...state,
                charts: filterCharts(state.charts, action.data)
            }
        case 'CHART - VALUES REVERSE':
            return {
                ...state,
                charts: reverseCharts(state.charts)
            }
        case 'CHART - OPTIONS APPEND':
            return {
                ...state,
                charts: {
                    ...state.charts,
                    options: appendOption(option)
                }
            }
        case 'CHART - LOADING':
            return {
                ...state,
                charts: {
                    ...state.charts,
                    loading: action.loading
                }
            }
        case 'CHART - STATE CHANGE':
            return {
                ...state,
                charts: {
                    ...state.charts,
                    filtered: state.charts.filtered ? false : true
                }
            }
        case 'CACHE - RESTORE':
            return action.data;
        default:
            return state;
    }
}
