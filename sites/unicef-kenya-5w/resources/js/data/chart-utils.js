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
            return Maps(loadingState.values, "LOADING", "loading", "CATEGORY");
        case "PIE":
            return Pie(loadingState.values, "LOADING", "loading", "CATEGORY");
        case "TREEMAP":
            return TreeMap(loadingState.values, "LOADING", "loading", "CATEGORY");
        default:
            return Bar(loadingState.values, "LOADING", "loading", "CATEGORY");
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

export const generateOptions = (type, data, subtitle, valtype, locations) => {
    switch (type) {
        case "MAPS":
            return Maps(data,subtitle, valtype, locations);
        case "PIE":
            return Pie(data, subtitle, valtype, locations);
        case "TREEMAP":
            return TreeMap(data, subtitle, valtype, locations);
        default:
            return Bar(data, subtitle, valtype, locations);
    }
}