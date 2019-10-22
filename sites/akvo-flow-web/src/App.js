import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './Home'

const BASE_URL = process.env.REACT_APP_BASE_URL;

class App extends Component {

    render () {
        return (
            <BrowserRouter key="main-route">
                <Route key="default-route" path={ BASE_URL + "/:instance/:surveyid"} render={ props => <Home key="home" {...props} />} />
            </BrowserRouter>
        )
    }
}

export default App;
