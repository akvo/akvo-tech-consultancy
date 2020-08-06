import flattenDeep from 'lodash/flattenDeep';
import { flatten } from '../../data/utils.js';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';
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
        funds:0,
        contrib:0,
    }],
    filtered: [],
    filters: [],
    filteredpoints: [],
    countries: [],
    countrygroups: [],
    global: true
};


export const updateState = (filters, countries, countrygroups, state) => {
    let master = state.master;
    let datapoints = state.datapoints;
    let filtered = [];
    if (filters.length > 0) {
        filtered = master.map(x => {
            let values = x.values.filter(v => filters.includes(v.id));
            let dp = [];
            let unique_values = [];
            if (values.length !== 0) {
                dp = values.map(v => v.datapoints);
                dp = flattenDeep(dp);
                dp = uniq(dp);
            }
            if (dp.length > 0){
                unique_values = dp;
                dp = dp.map(d => {
                    return datapoints.find(p => p.datapoint_id === d && p.global === false);
                });
                dp = dp.filter(x => x);
            };
            return {
                ...x,
                total: dp.length,
                global: unique_values.length,
                values: values,
            }
        });
    }
    if (countries.length > 0 && filtered.length > 0) {
        filtered = filtered.filter(x => countries.includes(x.country_id));
    }
    if (countries.length > 0 && filtered.length === 0) {
        filtered = master.filter(x => countries.includes(x.country_id));
    }
    let filteredpoints = [];
    filtered.forEach(x => {
        x.values.forEach(v => {
            filteredpoints = [...filteredpoints, ...v.datapoints];
        });
    });
    filteredpoints = uniq(filteredpoints);
    if (!state.global) {
        if(countries.length > 0 || filters.length > 0) {
            let percountry = state.datapoints.filter(x => x.global === false);
                percountry = percountry.map(x => x.datapoint_id);
            filteredpoints = intersection(filteredpoints, percountry);
        }
        if (countries.length === 0 && filters.length === 0) {
            filteredpoints = state.datapoints.filter(x => x.global === false);
            filteredpoints = filteredpoints.map(x => x.datapoint_id);
        }
    }
    if (state.global) {
        if (countries.length === 0 && filters.length === 0) {
            filteredpoints = state.datapoints.map(x => x.datapoint_id);
        }
    }
    return {
        ...state,
        filters: filters,
        countries: countries,
        countrygroups: countrygroups,
        filtered: filtered,
        filteredpoints: filteredpoints
    };
}

const yieldChildrens = (data, yields=[]) => {
    if (data.childrens.length === 0) {
        yields = [...yields, data.id];
    }
    if (data.childrens.length > 0) {
        data.childrens.forEach(x => {
            yields = yieldChildrens(x, yields);
        });
    }
    return yields;
}

export const toggleFilter = (state, masterfilter, id) => {
    let filters = state.filters;
    let countries = state.countries;
    let countrygroups = state.countrygroups;
    if (filters.includes(id)){
        filters = filters.filter(x => x !== id);
    } else {
        filters = [...filters, id]
    }
    masterfilter = flatten(masterfilter);
    filters = masterfilter.filter(x => filters.includes(x.id))
    let new_filters = [];
    filters.forEach(x => {
        let child_filters = yieldChildrens(x);
        new_filters = [...new_filters, ...child_filters];
    });
    new_filters = uniq(new_filters);
    return updateState(new_filters, countries, countrygroups, state);
}

export const removeFilters = (state, ids) => {
    let filters = reject(state.filters, x => ids.includes(x));
    let countries = state.countries;
    let countrygroups = state.countrygroups;
    return updateState(filters, countries, countrygroups, state);
}

export const toggleCountry = (state, id) => {
    let filters = state.filters;
    let countries = state.countries;
    let countrygroups = state.countrygroups;
    if (countries.includes(id)){
        countries = countries.filter(x => x !== id);
    } else {
        countries = [...countries, id]
    }
    return updateState(filters, countries, countrygroups, state);
}

export const toggleCountryGroup = (state, source, id) => {
    let filters = state.filters;
    let countries = [];
    let countrygroups = state.countrygroups;
    if (countrygroups.includes(id)){
        countrygroups = countrygroups.filter(x => x !== id);
    } else {
        countrygroups = [...countrygroups, id]
    }
    source = source.countries;
    source.forEach(x => {
        let groups = x.groups.map(g => g.id);
        countrygroups.forEach(g => {
            countries = groups.includes(g)
                ? [...countries, x.id]
                : countries
        })
        return;
    });
    return updateState(filters, countries, countrygroups, state);
}
