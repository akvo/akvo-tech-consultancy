import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './Home'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { questionReducers } from './reducers/questionReducers.js'
import { BASE_URL, CACHE_URL } from './util/Environment.js'

const store = createStore(questionReducers)

class App extends Component {

    render () {
        let path = "/:instance/:surveyid"
        if (CACHE_URL) {
            path = path + "/:cacheid";
        }
        return (
	        <Provider store={store}>
            <BrowserRouter>
                <Route path={ BASE_URL + path} render={ props => <Home key="home" {...props} />} />
            </BrowserRouter>
	        </Provider>
        )
    }
}

export default App;
