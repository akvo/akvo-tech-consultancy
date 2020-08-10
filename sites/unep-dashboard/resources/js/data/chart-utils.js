import Bar from './options/Bar';
import Maps from './options/Maps';
import Pie from './options/Pie';
import TreeMap from './options/TreeMap';
import SanKey from './options/SanKey';
import Radar from './options/Radar';
import BarStack from './options/BarStack';

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

export const generateOptions = (type, title, subtitle, props, dataset, extra={}) => {
    switch (type) {
        case "MAPS":
            return Maps(title, subtitle, props, dataset, extra);
        case "PIE":
            return Pie(title, subtitle, props, dataset, extra);
        case "ROSEPIE":
            return Pie(title, subtitle, props, dataset, extra, {roseType: "area"});
        case "TREEMAP":
            return TreeMap(title, subtitle, props, dataset, extra);
        case "SANKEY":
            return SanKey(title, subtitle, props, dataset, extra);
        case "RADAR":
            return Radar(title, subtitle, props, dataset, extra);
        case "BARSTACK":
            return BarStack(title, subtitle, props, dataset, extra);
        default:
            return Bar(title, subtitle, props, dataset, extra);
    }
}
