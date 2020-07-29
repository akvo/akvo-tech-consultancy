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
