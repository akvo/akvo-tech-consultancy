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
