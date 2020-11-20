import "./bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";

if (document.getElementById("app")) {
    ReactDOM.render(<Main />, document.getElementById("app"));
}
