import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './Home'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { questionReducers } from './reducers/questionReducers.js'

const PROD_URL = false
const BASE_URL = ( PROD_URL ? "/akvo-flow-web" : process.env.REACT_APP_BASE_URL);

const store = createStore(questionReducers)

class App extends Component {

    render () {
        return (
	        <Provider store={store}>
            <BrowserRouter>
                <Route path={ BASE_URL + "/:instance/:surveyid"} render={ props => <Home key="home" {...props} />} />
            </BrowserRouter>
	        </Provider>
        )
    }
}

export default App;
