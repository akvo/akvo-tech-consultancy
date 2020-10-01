import Bar from './options/Bar';
import Pie from './options/Pie';
import Scatter from './options/Scatter';
import Maps from './options/Maps';

export const generateData = (col, line, height) => {
    return {
        column: col,
        line: line,
        style: {
            height: height,
            maxWidth: "100%",
            width: "100%"
        }
    }
}

export const generateOptions = (type, title, data) => {
    switch (type) {
        case "MAPS":
            return Maps(title, data);
        case "PIE":
            return Pie(title, data);
        case "SCATTER":
            return Scatter(title, data);
        default:
            return Bar(title, data);
    }
}
