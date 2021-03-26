import Bar from "./options/Bar";
import Histogram from "./options/Histogram";
import Pie from "./options/Pie";
import Scatter from "./options/Scatter";
import Maps from "./options/Maps";
import CustomStackBar from "./options/CustomStackBar";

export const generateData = (col, line, height) => {
    return {
        column: col,
        line: line,
        style: {
            height: height,
            maxWidth: "100%",
            width: "100%"
        }
    };
};

export const generateOptions = (type, title, data, compare = false) => {
    switch (type) {
        case "MAPS":
            return Maps(title, data, compare);
        case "PIE":
            // return Pie(title, data);
            return CustomStackBar(title, data, compare);
        case "SCATTER":
            return Scatter(title, data);
        case "HISTOGRAM":
            return Histogram(title, data);
        case "HORIZONTAL BAR":
            return Bar(title, data, true, false, compare);
        case "UNSORTED HORIZONTAL BAR":
            return Bar(title, data, true, true, compare);
        default:
            // return Bar(title, data);
            return Bar(title, data, false, false, compare);
    }
};
