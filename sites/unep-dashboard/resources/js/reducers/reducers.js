import {
    showPage,
} from './helpers/page-helpers.js';
import {
    appendFilters,
    updateSelectedFilters,
    showFilters,
} from './helpers/filter-helpers.js';

const initialState = {
    pageActive: "home",
    filters: [[
        {
            name:'loading',
            code:'loading',
            id:1
        },
        {
            name:'mantap',
            code:'mantap',
            id:2
        }
    ]],
    filterDepth: 1,
    filterSelected: [{
        id: 1,
        name: 'Select Programs'
    }],
    filterActive: false,
    countries: [{
        name: 'Select Country',
        code: 'Loading',
        id: 1,
    }],
    countrySelected: 'Select Country',
    chartData: [
        {
            id: 1,
            values: [{ code: "Loading", name: "Loading", value: 0 }]
        }
    ],
    chartOptions: [],
    chartActive: {
            id: 1,
            values: [{ code: "Loading", name: "Loading", value: 0 }]
    }
}

export const states = (state = initialState, action) => {
    switch (action.type) {
        case 'PAGE - CHANGE PAGE':
            return showPage(state, action.page)
        case 'FILTERS - PROGRAM INIT':
            return {
                ...state,
                filters: [action.filters]
            }
        case 'FILTERS - PROGRAM APPEND':
            return appendFilters(state, action.filters, action.depth)
        case 'FILTERS - PROGRAM SELECT':
            return updateSelectedFilters(state, action.name, action.id, action.depth)
        case 'FILTERS - PROGRAM CHANGE':
            return showFilters(state, action.filters)
        case 'FILTERS - COUNTRY INIT':
            return {
                ...state,
                countries: action.countries
            }
        case 'FILTERS - CHANGE COUNTRY':
            return {
                ...state,
                countrySelected: action.country
            }
        case 'CHART - STORE':
            return {
                ...state,
                chartData: storeChart(action.id, action.values)
            }
        case 'CHART - CHANGE':
            return {
                ...state,
                chartActive: changeActive(state.chartData, action.id)
            }
        case 'CHART - OPTIONS':
            return {
                ...state,
                chartActive: (action.id)
            }
        default:
            return state;
    }
}
