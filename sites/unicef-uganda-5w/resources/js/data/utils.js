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

export const getCovidTable = (params) => {
    let data = params.data;
    let html = '<hr/>District: <strong>' + params.name + '</strong></br>';
    html += '<table class="table table-bordered">';
    html += '<thead class="thead-dark">';
    html += '<tr>';
    html += '<th width="200">Cases</th>';
    html += '<th width="50" class="text-right">total</th>';
    html +='</tr>';
    html += '</thead>';
    html += '<tbody>';
    for (const d in data.data) {
        if (d !== "name") {
            html += '<tr><td width="200">' + titleCase(d) + '</td>';
            html += '<td width="50" class="text-right">' + data.data[d] + '</td></tr>';
        }
    }
    html += '</tbody>';
    html += '</table>';
    return html;
}
