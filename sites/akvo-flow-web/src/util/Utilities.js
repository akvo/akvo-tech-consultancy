export const CopyToClipboard = (text) => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    dummy.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

export const validateMinMax = (value, q) => {
    if (q.validation && value !== null){
        value = isNaN(value) ? value : parseInt(value);
        let min = q.validation.minVal;
        let max = q.validation.maxVal;
        if (min) {
            value = value < parseInt(min) ? null : value;
        }
        if (max) {
            value = value > parseInt(max) ? null : value;
        }
    };
    return value;
}

export const validateDoubleEntry = (value, q) => {
    let check = false;
    if (q.type === "text") {
        check = true;
    }
    if (q.type === "number") {
        check = true;
    }
    if (q.requireDoubleEntry && value !== null && check){
        let validator = localStorage.getItem('V-' + q.id);
        validator = q.type === "number" ? parseInt(validator) : validator;
        value = isNaN(value) ? value : parseInt(value);
        value = value === validator ? value : null;
    };
    return value;
}

export const colorPallet = ["#173F5F","#20639B","#3CAEA3","#ED553B"];
