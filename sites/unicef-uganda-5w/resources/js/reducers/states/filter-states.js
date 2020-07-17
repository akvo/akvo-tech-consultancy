export const filterState = {
    overviews:{
        filters: {
            id:0,
            name:'Domains',
            kind:'options',
            base:'domain'
        },
        maps: {
            value: 'total',
            formula: 'sum',
        },
        data: [{
            id: 0,
            form_instance_id: 0,
            org_type: 0,
            org_name: 0,
            activity: 0,
            region: 0,
            district: 0,
            domain: 0,
            sub_domain: 0,
            completion_date: "2020-07-31",
            quantity: 1,
            total: 0,
            new: 0
        }],
    },
    activities:{
        filters: {
            id:0,
            name:'Organisations',
            kind:'cascades',
            base:'org_name'
        },
        maps: {
            value: 'org_name',
            formula: 'count',
        },
        data: [{
            id: 0,
            form_instance_id: 0,
            org_type: 0,
            org_name: 0,
            activity: 0,
            region: 0,
            district: 0,
            domain: 0,
            sub_domain: 0,
            completion_date: "2020-07-31",
            quantity: 1,
            total: 0,
            new: 0
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
            id: filter.id,
            name: filter.text,
        },
        data: new_data
    };
    let results = {
        ...state,
        [page] : new_state,
    }
    return results;
}
