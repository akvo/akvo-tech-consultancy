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
            let company = (c.case_number !== null) ? c.case_number + ' ' + c.company : c.company;
            // implement case number
            source.push({ id: c.id, name: name, kind: c.kind, company: company, total: c.total, submission: c.submission, case_number: c.case_number });
            // source.push({ id: c.id, name: name, kind: c.kind, company: x.name, company: c.company, total: c.total, submission: c.submission, case_number: c.case_number });
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

export const textWordWrap = (str) => {
    let words = str.replace(/(?![^\n]{1,30}$)([^\n]{1,30})\s/g, '$1\n').split('\n');
    words = words.map(x => {
        return x+'\n';
    });
    return words.join('');
};