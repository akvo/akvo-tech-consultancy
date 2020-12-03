export const checkCustomOption = (data) => {
    let mc = data.help
        ? (data.help.text !== null
            ? data.help.text.includes("##MULTICASCADE##")
            : false)
        : false;
    if (mc) {
        mc = mc
            ? data.help.text.substring(data.help.text.lastIndexOf("##MULTICASCADE##") + 16)
            : false;
    }
    return mc;
}

export const checkUnit = (data) => {
    let unit = data.help ? (data.help.text !== null ? data.help.text.includes("##UNIT##") : false) : false;
    if (unit) {
        unit = unit
            ? data.help.text.substring(data.help.text.lastIndexOf("##UNIT##") + 8)
            : false;
    }
    return unit;
}
