import countBy from "lodash/countBy";
import maxBy from "lodash/maxBy";

export const getHighest = (records, object_key) => {
    records = countBy(records, object_key);
    records = Object.keys(records).map(function(key) {
        return { name: key, value: records[key] };
    });
    records = maxBy(records, "value");
    return records;
};

export const flatFilters = filters => {
    let source = [];
    filters.map(x => {
        x.childrens.map(c => {
            let name = x.name + " - " + c.kind;
            source.push({ id: c.id, name: name, kind: c.kind, company: x.name, company: c.company, total: c.total, submission: c.submission });
        });
    });
    return source;
};

export const randomVal = () => {
    return Math.floor(Math.random() * 11);
};

export const initialNotification = {
    variant: "success",
    message: "",
    active: false
};
