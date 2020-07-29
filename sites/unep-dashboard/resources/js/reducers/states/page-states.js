import countBy from 'lodash/countBy';
import uniq from 'lodash/uniq';
import { flatten, parentDeep } from '../../data/utils.js';
export const pageState= {
    name: "overviews",
    loading: true,
    sidebar: false,
    filters: [{
        id: 1,
        parent_id: null,
        code: "Loading",
        name: "Loading",
        childrens: []
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
    badges: [{
        id: 1,
        parent_id: null,
        code: "Loading",
        name: "Loading",
        count: 0,
        childrens: []
    }]
}

export const getBadges = (data, masterfilter) => {
    if (data.filters.length > 0) {
        let filters = flatten(masterfilter);
        let active = data.filters.map(x => {
            let current = filters.find(f => f.id == x);
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
