import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { states } from "./reducers/reducers.js";
import Main from "./components/Main.js";

import "./App.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fab, fas);

const store = createStore(states);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                {" "}
                <Main />{" "}
            </Provider>
        );
    }
}

export default App;
