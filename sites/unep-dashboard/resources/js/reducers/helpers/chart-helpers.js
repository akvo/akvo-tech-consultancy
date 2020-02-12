export const storeValues = (data, { id, values }) => {
    console.log(values);
    let newdata = { id: id, values: values };
    console.log(newdata);
    return [...data, newdata];
};

export const storeOptions = (options, id, option) => {
    return [...options, { id: id, option: option }];
};
