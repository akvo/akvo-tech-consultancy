import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import reject from 'lodash/reject';

export const dataState = {
    master: [{
            country_id: 0,
            country_name: "Loading",
            global:0,
            total:0,
            values: [{
                id:1,
                datapoints: [0],
                total:0
            }]
    }],
    datapoints: [{
        datapoint_id:0,
        global:false,
    }],
    filtered: [],
    filters: [],
    countries: [],
};

const updateState = (filters, state) => {
    let master = state.master;
    let datapoints = state.datapoints;
    let filtered = [];
    if (filters.length > 0) {
        filtered = master.map(x => {
            let values = x.values.filter(v => filters.includes(v.id));
            let dp = [];
            if (values.length !== 0) {
                dp = values.map(v => v.datapoints);
                dp = flattenDeep(dp);
                dp = uniq(dp);
            }
            if (dp.length > 0){
                dp = dp.map(d => {
                    return datapoints.find(p => p.id === d && p.global === false);
                });
            };
            return {
                ...x,
                total: dp.length,
                global: values.length,
                values: values,
            }
        });
    }
    return {
        ...state,
        filtered: filtered,
        filters: filters,
    };
}

export const toggleFilter = (state, id) => {
    let filters = state.filters;
    let filtered = [];
    if (filters.includes(id)){
        filters = filters.filter(x => x !== id);
    } else {
        filters = [...filters, id]
    }
    return updateState(filters, state);
}

export const removeFilters = (state, ids) => {
    let filters = reject(state.filters, x => ids.includes(x));
    return updateState(filters, state);
}
