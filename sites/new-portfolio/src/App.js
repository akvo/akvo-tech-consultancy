import "antd/dist/antd.css";
import "./App.scss";
import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Layout } from "antd";
import { HeaderWeb, FooterWeb } from "./components";
import { Home } from "./pages";

function App() {
  return (
    <div className="App">
      <Layout>
        <HeaderWeb />
        
        <Router>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
        
        <FooterWeb />
      </Layout>
    </div>
  );
}

export default App;
