import Bar from './options/Bar';
import Pie from './options/Pie';
import Scatter from './options/Scatter';

export const generateData = (col, line, height) => {
    return {
        column: col,
        line: line,
        style: {
            height: height
        }
    }
}

export const generateOptions = (type, title, data) => {
    switch (type) {
        case "PIE":
            return Pie(title, data);
        case "SCATTER":
            return Scatter(title, data);
        default:
            return Bar(title, data);
    }
}
