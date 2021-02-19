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
import { Home, DataPortal } from "./pages";

const defaultState = {
  page: {
    title: 'Home',
    location: '/home',
    header: 'dark',
  },
};

function App() {
  const [state, setState] = useState(defaultState);

  const updateState = (props) => {
    setState(props);
  }

  useEffect(() => {
    console.log(state);
    document.title = state.page.title;
  }, [state]);

  return (
    <div className="App">
      <Layout>
        <Router>
          <HeaderWeb value={state} />
          <Switch>
            <Route exact path="/">
              <Home value={state} onLoad={(props) => updateState(props)} />
            </Route>
            <Route exact path="/data-portal">
              <DataPortal value={state} onLoad={(props) => updateState(props)} />
            </Route>
          </Switch>
          <FooterWeb />
        </Router>
      </Layout>
    </div>
  );
}

export default App;
