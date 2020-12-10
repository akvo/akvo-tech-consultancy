import {
    baseState,
} from './states/base-states.js';
import {
    pageState,
    showPage,
} from './states/page-states.js';
import {
    filterState,
    initFilter,
    changeFilter,
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
    base: baseState,
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
        case 'FILTER - INIT':
            return {
                ...state,
                base: { ...state.base, surveys: action.base},
                filters: {
                    overviews: initFilter(action.base, state.filters.overviews,'overviews'),
                },
            }
        case 'FILTER - CHANGE':
            return {
                ...state,
                filters: changeFilter(state.base, state.filters, action.page, action.selected),
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
                    options: appendOption(state.charts, action.id, action.page, action.option)
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
        case 'CHART - COVID INIT':
            return {
                ...state,
                charts: {
                    ...state.charts,
                    covid: action.data
                }
            }
        case 'CACHE - RESTORE':
            return action.data;
        default:
            return state;
    }
}
