import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';
var currencyFormatter = require('currency-formatter');

export const formatCurrency = (x) => {
    return currencyFormatter.format(x, {
        decimal: '.',
        thousand: '.',
        precision: 0,
        format: '%v'
    });
}


export const flatDeep = (arr, d = 1) => {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                : arr.slice();
};

export const flatten = (arr) => {
    return arr? arr.reduce((result, item) => [
        ...result,
        { id: item.id, name: item.name, parent_id: item.parent_id, childrens: item.childrens },
        ...flatten(item.childrens)
    ], []) : [];
}

export const parentDeep = (id, data) => {
    let parent = data.find(x => x.id === id);
    if (parent.parent_id !== null){
        return parentDeep(parent.parent_id, data);
    }
    return parent;
}

export const digDataPoints = (data, id, active) => {
    let datapoints = data.map(b => {
        let dp = b.find(v => v.id === id);
        if (dp){
            return dp.datapoints;
        }
        return dp;
    });
    let collections = [];
    datapoints = datapoints.filter(d => d);
    datapoints.forEach(d => {
        collections = [...collections, ...d];
    })
    datapoints = uniq(collections);
    if (active) {
        return intersection(datapoints, active);
    }
    return datapoints;
}

export const getChildsData = (data, countries, active) => {
    data = data.map(x => {
        if (x.childrens.length > 0){
            return {
                ...x,
                children:getChildsData(x.childrens, countries, active),
            }
        }
        let datapoints = digDataPoints(countries, x.id, active);
        return {
            ...x,
            children: x.childrens,
            value: datapoints.length,
            datapoints: datapoints
        }
    });
    return data;
}

export const getChildPoints = (parent, points) => {
    if (parent) {
        parent.forEach(x => {
            if (x.children.length > 0) {
                getChildPoints(x.chidren, points);
            }
            if (x.children.length === 0) {
                points = [...points, ...x.datapoints];
            }
        });
    }
    return uniq(points);
}

export const pushToParent = (parent)  => {
    return parent.map(x => {
        if (x.children.length > 0) {
            return {
                name: x.name,
                value: getChildPoints(x.children, []).length,
            }
        }
        return {
            name: x.name,
            value: x.datapoints.length,
        }
    });
}
