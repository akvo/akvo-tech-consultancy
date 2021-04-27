import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie11';
import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";


if (document.getElementById("app")) {
    ReactDOM.render(<Main />, document.getElementById("app"));
}
