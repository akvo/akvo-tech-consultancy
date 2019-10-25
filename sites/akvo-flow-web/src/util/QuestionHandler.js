export const getQuestionType = (props) => {
    let qtype = props.type
    if (props.validationRule) {
        qtype = (props.validationRule.validationType === "numeric" ? "number" : "text")
    }
    if (props.options) {
        qtype = "option"
    }
    switch (qtype) {
        case "signature": break
        case "photo": return "photo"
        case "number": return "number"
        case "option": return "option"
        case "cascade": return "cascade"
        case "geo": return "text"
        case "date": return "date"
        default:
            return "text"
    }
    return qtype
}

export const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

