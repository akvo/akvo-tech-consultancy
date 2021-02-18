import "antd/dist/antd.css";
import "./App.scss";
import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Layout } from "antd";
import { HeaderWeb, FooterWeb } from "./components";
import { Home } from "./pages";

const defaultState = {
  page: {
    location: 'home',
    header: 'green',
  },
  home: {
    section: 'home',
  }
};

function App() {
  const [state, setState] = useState(defaultState);

  const updateState = (props) => {
    setState(props);
  }

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div className="App">
      <Layout>
        <HeaderWeb value={state} />
        
        <Router>
          <Switch>
            <Route exact path="/">
              <Home value={state} onLoad={(props) => updateState(props)} />
            </Route>
          </Switch>
        </Router>
        
        <FooterWeb />
      </Layout>
    </div>
  );
}

export default App;
