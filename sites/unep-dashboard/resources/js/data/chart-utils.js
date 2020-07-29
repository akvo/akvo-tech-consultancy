import Bar from './options/Bar';
import Maps from './options/Maps';
import Pie from './options/Pie';
import TreeMap from './options/TreeMap';

const loadingState = {
        id: 1,
        name: "",
        units: "",
        description: "Loading",
        values: [{ id:1, code: "", name: "Loading", value: 0}]
}

export const loadingChart = (type) => {
    switch (type) {
        case "MAPS":
            return Maps("LOADING", "loading", loadingState.values);
        case "PIE":
            return Pie("LOADING", "loading", loadingState.values);
        case "TREEMAP":
            return TreeMap("LOADING", "loading", loadingState.values);
        default:
            return Bar("LOADING", "loading", loadingState.values);
    }
};

export const generateData = (col, line, height) => {
    return {
        column: col,
        line: line,
        style: {
            height: height
        }
    }
}

export const generateOptions = (type, title, subtitle, data, extra) => {
    switch (type) {
        case "MAPS":
            return Maps(title, subtitle, data, extra);
        case "PIE":
            return Pie(title, subtitle, data, extra);
        case "TREEMAP":
            return TreeMap(title, subtitle, data, extra);
        default:
            return Bar(title, subtitle, data, extra);
    }
}
