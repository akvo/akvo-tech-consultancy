class QuestionHandler {

    getQuestionType (props) {
        let qtype = props.type
        if (props.validationRule) {
            qtype = (props.validationRule.validationType === "numeric" ? "number" : "text")
            return qtype
        }
        switch (qtype) {
            case "signature":
            case "photo":
                return "file"
            case "number":
                return "number"
            case "cascade":
                return "select"
            case "geo": return "text"
            case "date": return "date"
            default:
                return "text"
        }
        console.log(qtype)
        return qtype
    }

}

export default QuestionHandler;
