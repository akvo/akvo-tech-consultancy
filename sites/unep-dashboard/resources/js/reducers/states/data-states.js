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
    countrygroups: [],
};

export const updateState = (filters, countries, countrygroups, state) => {
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
    if (countries.length > 0 && filtered.length > 0) {
        filtered = filtered.filter(x => countries.includes(x.country_id));
    }
    if (countries.length > 0 && filtered.length === 0) {
        filtered = master.filter(x => countries.includes(x.country_id));
    }
    return {
        ...state,
        filters: filters,
        countries: countries,
        countrygroups: countrygroups,
        filtered: filtered
    };
}

export const toggleFilter = (state, id) => {
    let filters = state.filters;
    let countries = state.countries;
    let countrygroups = state.countrygroups;
    if (filters.includes(id)){
        filters = filters.filter(x => x !== id);
    } else {
        filters = [...filters, id]
    }
    return updateState(filters, countries, countrygroups, state);
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
