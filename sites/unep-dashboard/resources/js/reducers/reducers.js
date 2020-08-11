import uniqBy from 'lodash/uniqBy';
import {
    pageState,
    getBadges,
    addComparison,
} from './states/page-states.js';
import {
    dataState,
    updateState,
    toggleFilter,
    toggleCountry,
    toggleCountryGroup,
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
    let keepfilter;
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
            let groups = action.countries.map(x => x.groups);
            let all_groups = [];
            groups.forEach(x => {all_groups = [...all_groups, ...x]});
            all_groups = uniqBy(all_groups, 'id');
            return {
                ...state,
                page: {
                    ...state.page,
                    countries: action.countries,
                    countrygroups: all_groups,
                    filters: action.filters,
                },
                data: {
                    ...state.data,
                    master: action.data,
                    datapoints: action.datapoints,
                    filteredpoints: action.datapoints.map(x => x.datapoint_id)
                }
            }
        case 'PAGE - CHANGE PAGE':
            keepfilter = state.page.keepfilter;
            if (!keepfilter) {
                data = updateState([], [], [], state.data)
            }
            return {
                ...state,
                page: {
                    ...state.page,
                    name: action.page,
                    badges: !keepfilter ? [] : state.page.badges,
                    sidebar: !keepfilter ? {
                        active: false,
                        selected: "filters",
                        group: false
                    } : state.page.sidebar
                },
                data: !keepfilter ? data : state.data
            }
        case 'PAGE - SIDEBAR TOGGLE':
            let active = state.page.sidebar.active;
            let different = state.page.sidebar.selected !== action.selected;
            return {
                ...state,
                page: {
                    ...state.page,
                    sidebar: {
                        ...state.page.sidebar,
                        active: different && active ? true : (!active ? true : false),
                        selected: action.selected
                    }
                }
            }
        case 'PAGE - SIDEBAR SWITCH GROUP':
            let cleared = updateState(state.data.filters, [], [], state.data)
            return {
                ...state,
                page: {
                    ...state.page,
                    sidebar: {
                        ...state.page.sidebar,
                        group: state.page.sidebar.group ? false : true,
                    }
                },
                data: cleared
            }
        case 'PAGE - BADGE STORE':
            return {
                ...state,
                page: {
                    ...state.page,
                    badges: action.badges
                }
            }
        case 'PAGE - SWITCH KEEP FILTER':
            keepfilter = state.page.keepfilter ? false : true
            return {
                ...state,
                page: {
                    ...state.page,
                    keepfilter: keepfilter
                }
            }
        case 'PAGE - SWITCH FUND CONTRIBUTION':
            return {
                ...state,
                page: {
                    ...state.page,
                    fundcontrib: state.page.fundcontrib ? false : true
                }
            }
        case 'PAGE - COMPARE TOGGLE COLUMN':
            return {
                ...state,
                page: {
                    ...state.page,
                    compare: {
                        ...state.page.compare,
                        add: state.page.compare.add ? false : true
                    }
                }
            }
        case 'PAGE - COMPARE ADD COUNTRY':
            data = state.page.compare.countries;
            return {
                ...state,
                page: {
                    ...state.page,
                    compare: {
                        ...state.page.compare,
                        countries: addComparison(state.page.compare.countries, state.page.countries, action.id),
                        init: false
                    }
                }
            }
        case 'PAGE - COMPARE REMOVE COUNTRY':
            data = state.page.compare.countries;
            data = data.filter(x => x.country_id !== action.id);
            return {
                ...state,
                page: {
                    ...state.page,
                    compare: {
                        ...state.page.compare,
                        countries: data,
                        init: data.length === 0 ? true : false
                    }
                }
            }
        case 'DATA - TOGGLE FILTER':
            data = toggleFilter(state.data, state.page.filters, action.id);
            return {
                ...state,
                data: data,
                page: {
                    ...state.page,
                    badges: getBadges(data, state.page.filters)
                }
            }
        case 'DATA - TOGGLE COUNTRY':
            data = action.group
                ?  toggleCountryGroup(state.data, state.page, action.data.id)
                :  toggleCountry(state.data, action.data.id)
            return {
                ...state,
                data: data,
            }
        case 'DATA - TOGGLE GLOBAL':
            let new_state = {
                ...state.data,
                global: state.data.global ? false : true
            }
            new_state = updateState(new_state.filters, new_state.countries, new_state.countrygroups, new_state);
            return {
                ...state,
                data: {
                    ...new_state,
                    global: new_state.global
                }
            }
        case 'DATA - REMOVE FILTERS':
            data = removeFilters(state.data, action.ids);
            return {
                ...state,
                data: data,
                page: {
                    ...state.page,
                    badges: getBadges(data, state.page.filters)
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
