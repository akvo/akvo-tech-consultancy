import filter from 'lodash/filter';

export const checkCache = (id) => {
    if (localStorage.getItem('locval_' + id) !== null){
        let cached = localStorage.getItem('locval_' + id);
        return JSON.parse(cached);
    }
    return false;
}

export const titleCase = (string) => {
  let sentence = string.toLowerCase().split(" ");
  for(let i = 0; i< sentence.length; i++){
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
      if (sentence[i].length < 4) {
          sentence[i] = sentence[i].toUpperCase();
      }
      if (sentence[i] === "NEW")
      {
          sentence[i] = "New";
      }
      if (sentence[i] === "OF"
          || sentence[i] === "AND"
          || sentence[i] === "OR"
      ) {
          sentence[i] = sentence[i].toLowerCase();
      }
  }
  return sentence.join(" ");
}

export const flattenLocations = (locations, results) => {
    locations.forEach(x => {
        if (x.children_nested.length > 0) {
            flattenLocations(x.children_nested, results);
        }
        if (x.children_nested.length === 0) {
            results.push(x);
        }
        return;
    });
    return results;
}

export const mapDataByLocations = (locations, data, config) => {
    let res = locations.map(x => {
        let dataByLocation = filter(data, (y) => {
            return y[config.maps.match_question].answer.toLowerCase().includes(x.name.toLowerCase());
        });
        let filteredData = filter(dataByLocation, (z => z.active === true));
        return {
            name: x.text,
            value: filteredData.length,
            active: true,
            details: dataByLocation,
        }
    });
    return res;
};

export const filterMapData = (filter, data, qid, answer) => {
    // filter = true mean data will filtered by legend
    // filter = false data will return back to normal
    if (answer.length > 0) {
        answer = answer.join('|').toLowerCase().split('|');
    }
    let active = filter ? false : true;
    let res = data.map(x => {
        if (typeof x[qid] === 'undefined') {
            // x.active = active;
            // return x;
            return {
                ...x,
                active: active,
            };
        }
        // includes
        if (answer.some(a => x[qid].answer.toLowerCase().includes(a) )) {
            return {
                ...x,
                active: true,
            };
        }
        // not includes
        if (! answer.some(a => x[qid].answer.toLowerCase().includes(a) )) {
            // x.active = active;
            // return x;
            return {
                ...x,
                active: active,
            };
        }
        // return x;
        return { ...x };
    });
    return res;
};

export const textWordWrap = (str) => {
    let words = str.replace(/(?![^\n]{1,30}$)([^\n]{1,30})\s/g, '$1\n').split('\n');
    words = words.map(x => {
        return x+'\n';
    });
    return words.join('');
};