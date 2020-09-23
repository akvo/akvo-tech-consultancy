import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';
import intersection from 'lodash/intersection';

var currencyFormatter = require('currency-formatter');

export const formatCurrency = (x) => {
    return currencyFormatter.format(x, {
        decimal: '.',
        thousand: ',',
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

export const translateValue = (data, locale) => {
    let name = data.name;
    if (locale !== 'en' && data.locale) {
        name = data.locale.filter(a => a.lang === locale);
        name = name.length > 0 ? name[0].text : data.name;
    }
    return name;
}

export const getChildsData = (data, countries, active, locale) => {
    data = data.map(x => {
        let name = translateValue(x, locale);
        if (x.childrens.length > 0){
            return {
                ...x,
                name: name,
                children:getChildsData(x.childrens, countries, active, locale),
            }
        }
        let datapoints = digDataPoints(countries, x.id, active);
        return {
            ...x,
            name: name,
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

export const pushToParent = (parent, locale)  => {
    return parent.map(x => {
        let name = translateValue(x, locale);
        if (x.children.length > 0) {
            return {
                name: name,
                value: getChildPoints(x.children, []).length,
                locale: x.locale
            }
        }
        return {
            name: name,
            value: x.datapoints.length,
            locale: x.locale
        }
    });
}

export const getAllChildsId = (parent, childs) => {
    childs.push(parent.id);
    if (parent.childrens.length > 0) {
        parent.childrens.forEach(x => {
            getAllChildsId(x, childs);
        });
    };
    return childs
}
export const toTitleCase = (str) => {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

export const scrollWindow = (x) => {
    window.scrollBy({
        top: (window.innerHeight - 100) / x,
        behavior: "smooth"
    });
}

export const reorderCountry = (data) => {
    data = sortBy(data, 'name');
    let allother = data.filter(x => x.name === "All" || x.name === "Other");
    data = data.filter(x => {
        if (x.name === "All" || x.name === "Other") {
            return false;
        }
        return true;
    });
    return [...data, ...allother];
}

export const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
