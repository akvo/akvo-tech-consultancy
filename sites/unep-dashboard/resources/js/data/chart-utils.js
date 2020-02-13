import Bar from './options/Bar';
import Maps from './options/Maps';
import Pie from './options/Pie';

export const loadingChart = {
    title: {
        text: "Loading... ",
        left: "center",
        top: "middle",
        textStyle: {
            color: "#222"
        }
    }
};

export const generateOptions = (type, title, data) => {
    switch (type) {
        case "MAPS":
            return Maps(data, title);
        case "PIE":
            return Pie(data, title);
        default:
            return Bar(data, title);
    }
}
