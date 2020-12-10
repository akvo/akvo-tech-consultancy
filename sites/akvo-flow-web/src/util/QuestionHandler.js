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
        case "video": return "video"
        case "number": return "number"
        case "option": return "option"
        case "cascade": return "cascade"
        case "geo": return "geo"
        case "date": return "date"
        default:
            return "text"
    }
    return qtype
}

export const parseAnswer = ({answer, qtype}) => {
    switch(qtype) {
        case "option":
            answer = answer ? answer.map(x => x.text) : null;
            answer = answer ? answer.join("|") : null;
            return answer;
        case "cascade":
            answer = answer ? answer.map(x => x.text) : null;
            answer = answer ? answer.join("|") : null;
            return answer;
        case "number":
            return answer ? answer.toString() : answer
        default:
            return answer
    }
}

export const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
