import countBy from 'lodash/countBy';
import maxBy from 'lodash/maxBy';

export const getHighest = (records, object_key) => {
    records = countBy(records, object_key);
    records = Object.keys(records).map(function(key) {
        return {name: key, value: records[key]};
    });
    records = maxBy(records, 'value');
    return records;
}
