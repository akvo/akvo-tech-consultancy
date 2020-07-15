import {
    pageState,
    showPage,
} from './states/page-states.js';
import {
    filterState,
    appendFilters,
    updateSelectedFilters,
    showFilters,
    addReducer,
    removeReducer,
} from './states/filter-states.js';
import {
    chartState,
    appendData,
    appendOption,
    selectCharts,
    filterCharts,
    reverseCharts,
} from './states/chart-states.js';
import { flatDeep } from '../data/utils.js';

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
        case 'FILTERS - PROGRAM INIT':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    reducer: {
                        ...state.filters.reducer,
                        list: [action.list]
                    },
                    list: [action.list],
                    childs: flatDeep(action.list.map(x => x.childs))
                }
            }
        case 'FILTERS - PROGRAM APPEND':
            if (action.kind === 'primary') {
                return {
                    ...state,
                    filters: appendFilters(state.filters, action.list, action.depth)
                }
            }
            return {
                ...state,
                filters:{
                    ...state.filters,
                    reducer: appendFilters(state.filters.reducer, action.list, action.depth)
                }
            }
        case 'FILTERS - PROGRAM SELECT':
            if (action.kind === 'primary') {
                return {
                    ...state,
                    filters: updateSelectedFilters(state.filters, action.id, action.parent_id, action.name, action.depth)
                }
            }
            return {
                ...state,
                filters: {
                    ...state.filters,
                    reducer: updateSelectedFilters(state.filters.reducer, action.id, action.parent_id, action.name, action.depth)
                }
            }
        case 'FILTERS - PROGRAM CHANGE':
            if (action.kind === 'primary') {
                return {
                    ...state,
                    filters: showFilters(state.filters, action.list)
                }
            }
            return {
                ...state,
                filters: {
                    ...state.filters,
                    reducer: showFilters(state.filters, action.list)
                }
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
        case 'FILTERS - REDUCER SHOW':
            return {
                ...state,
                filters: {
                    ...state.filters,
                    reducer: {
                        ...state.filters.reducer,
                        depth: 1,
                        list: [state.filters.reducer.list[0]],
                        selected: [state.filters.reducer.selected[0]],
                        show: state.filters.reducer.show ? false : true,
                    }
                }
            }
        case 'FILTERS - REDUCER APPEND':
            return {
                ...state,
                filters: addReducer(state.filters, action.id, action.parent_id)
            }
        case 'FILTERS - REDUCER REMOVE':
            return {
                ...state,
                filters: removeReducer(state.filters, action.id, action.parent_id)
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
