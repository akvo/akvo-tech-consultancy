import {
    pageState,
    showPage,
} from './states/page-states.js';
import {
    filterState,
    changeFilters,
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
            return {
                ...state,
                filters: {
                    ...state.filters,
                    list: action.list,
                    selected: {
                        ...state.filters.selected,
                        filter: childs[0].id
                    }
                }
            }
        case 'FILTERS - CATEGORY CHANGE':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    selected: {
                        ...state.filters.selected,
                        filter: changeFilters(state.filters.list, action.id, action.depth)
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
                    location_values: action.data
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
                    loading: true
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
        default:
            return state;
    }
}
