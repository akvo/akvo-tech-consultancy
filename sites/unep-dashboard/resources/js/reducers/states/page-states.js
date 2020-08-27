import countBy from 'lodash/countBy';
import uniq from 'lodash/uniq';
import { flatten, parentDeep } from '../../data/utils.js';
export const pageState= {
    name: "overviews",
    loading: true,
    sidebar: {
        active: false,
        selected: "filters",
        group: false
    },
    filters: [{
        id: 1,
        parent_id: null,
        code: "Loading",
        name: "Loading",
        childrens: [],
        locale: [{
            lang: 'id',
            text: 'Loading'
        }],
    }],
    countries: [{
        id: 1,
        name: "Loading",
        code: "Loading",
        groups: [{
            id: 1,
            parent_id: null,
            name: "Loading",
            code: "Loading",
        },{
            id: 2,
            parent_id: null,
            name: "Loading",
            code: "Loading",
        }]
    }],
    countrygroups: [{
        id: 2,
        parent_id: 1,
        code: "Loading",
        name: "Loading"
    }],
    keepfilter: true,
    fundcontrib: false,
    badges: [],
    compare: {
        init: true,
        items: [],
    }
}

export const getBadges = (data, masterfilter) => {
    if (data.filters.length > 0) {
        let filters = flatten(masterfilter);
        let active = data.filters.map(x => {
            let current = filters.find(f => f.id === x);
            return parentDeep(current.parent_id, filters);
        });
        let counts = countBy(active.map(x => x.id));
        active = uniq(active);
        let results = [];
        for (const id in counts) {
            let a = active.find(x => x.id === parseInt(id));
            results.push({...a, count: counts[id]})
        }
        return results;
    }
}

export const addComparison = (state, item, id, itemtype) => {
    let newitem = item.find(x => x.id === id);
    return [
        ...state,
        {id: newitem.id, name: newitem.name, itemtype: itemtype}
    ];
}
