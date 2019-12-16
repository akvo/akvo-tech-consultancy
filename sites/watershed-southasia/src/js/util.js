export const gradients = ["purple","peach","blue","morpheus-den"];
export const titleCase = (str) => {
    str = str.toLowerCase().split('-');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

export const insert = (str, index, value) => {
    return str.substr(0, index) + value + str.substr(index);
}

