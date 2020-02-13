import {
    pageState,
    showPage,
} from './states/page-states.js';
import {
    filterState,
    appendFilters,
    updateSelectedFilters,
    showFilters,
} from './states/filter-states.js';
import {
    chartState,
    appendData,
    appendOption,
    selectCharts,
    filterCharts,
} from './states/chart-states.js';

const initialState = {
    page: pageState,
    filters: filterState,
    charts: chartState,

}

export const states = (state = initialState, action) => {
    switch (action.type) {
        case 'PAGE - CHANGE PAGE':
            return {
                ...state,
                page: showPage(state.page, action.page)
            }
        case 'FILTERS - PROGRAM INIT':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    list: [action.list]
                }
            }
        case 'FILTERS - PROGRAM APPEND':
            return {
                ...state,
                filters: appendFilters(state.filters, action.list, action.depth)
            }
        case 'FILTERS - PROGRAM SELECT':
            return {
                ...state,
                filters: updateSelectedFilters(state.filters, action.name, action.id, action.depth)
            }
        case 'FILTERS - PROGRAM CHANGE':
            return {
                ...state,
                filters: showFilters(state.filters, action.list)
            }
        case 'FILTERS - COUNTRY INIT':
            return {
                ...state,
                filters : {
                    ...state.filters,
                    countries: action.countries
                }
            }
        case 'FILTERS - COUNTRY CHANGE':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    country: action.country
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
        case 'CHART - OPTIONS APPEND':
            return {
                ...state,
                charts: {
                    ...state.charts,
                    options: appendOption(option)
                }
            }
        default:
            return state;
    }
}
