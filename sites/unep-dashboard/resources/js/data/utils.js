export const flatDeep = (arr, d = 1) => {
   return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
                : arr.slice();
};

export const flatten = (arr) => {
    return arr? arr.reduce((result, item) => [
        ...result,
        { id: item.id, parent_id: item.parent_id, childrens: item.childrens },
        ...flatten(item.childrens)
    ], []) : [];
}
