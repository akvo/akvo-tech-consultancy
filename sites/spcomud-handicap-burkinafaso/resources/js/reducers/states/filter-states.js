export const filterState = {
    overviews:{
        filters: {
            survey_id: 0,
            survey_name: "Loading",
            form_id: 0,
            form_name: "Loading",
        },
        maps: {
            value: 'total',
            formula: 'sum',
        },
        data: [{
            // Maps Data
        }],
    },
}

export const initFilter = (base, state, page) => {
    return {
        filters: {...state.filters},
        data: base.data,
    }
}

export const changeFilter = (base, state, page, filter) => {
    let origin = filterState[page];
    let new_data = filter.id !== 0
        ? base.data.filter(x => x[origin.filters.base] === filter.id)
        : base.data;
    let new_state = {
        filters:{
            ...origin.filters,
            survey_id: filter.survey_id,
            survey_name: filter.survey_name,
            form_id: filter.form_id,
            form_name: filter.form_name,
        },
        data: new_data
    };
    let results = {
        ...state,
        [page] : new_state,
    }
    return results;
}
