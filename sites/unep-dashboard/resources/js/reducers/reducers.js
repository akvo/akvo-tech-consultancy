import {
    pageState,
    getBadges,
} from './states/page-states.js';
import {
    dataState,
    toggleFilter,
    removeFilters,
} from './states/data-states.js';
import {
    chartState,
    appendData,
    appendOption,
    selectCharts,
    filterCharts,
    reverseCharts,
} from './states/chart-states.js';

const initialState = {
    page: pageState,
    data: dataState,
    charts: chartState,

}

export const states = (state = initialState, action) => {
    let data;
    switch (action.type) {
        case 'PAGE - LOADING PAGE':
            return {
                ...state,
                page: {
                    ...state.page,
                    loading: action.status
                }
            }
        case 'PAGE - INIT PAGE':
            return {
                ...state,
                page: {
                    ...state.page,
                    countries: action.countries,
                    filters: action.filters,
                },
                data: {
                    ...state.data,
                    master: action.data,
                    datapoints: action.datapoints
                }
            }
        case 'PAGE - CHANGE PAGE':
            return {
                ...state,
                page: {
                    ...state.page,
                    name: action.page
                }
            }
        case 'PAGE - SIDEBAR TOGGLE':
            return {
                ...state,
                page: {
                    ...state.page,
                    sidebar: state.page.sidebar ? false : true
                }
            }
        case 'PAGE - BADGE STORE':
            return {
                ...state,
                page: {
                    ...state.page,
                    badges: action.badges
                }
            }
        case 'DATA - TOGGLE FILTER':
            data = toggleFilter(state.data, action.id);
            return {
                ...state,
                data: data,
                page: {
                    ...state.page,
                    badges: getBadges(data, state.page.filters)
                }
            }
        case 'DATA - REMOVE FILTERS':
            data = removeFilters(state.data, action.ids);
            return {
                ...state,
                data: data,
                page: {
                    ...state.page,
                    badges: state.page.badges.filter(x => x.id !== action.id)
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
