import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    applyMiddleware,
    compose,
    combineReducers,
    createStore
} from 'redux';
import thunk from 'redux-thunk';
import {
    Provider
} from 'react-redux';
import questionReducer from './reducers/questionReducer.js'
import answerReducer from './reducers/answerReducer.js'
require('dotenv').config()



const allReducers = combineReducers({
	questions: questionReducer,
	answer: answerReducer
});

const allStoreEnhancers = compose(
	applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const store = createStore(
	allReducers, {
		questions: [{
			title: 'What is your name?'
		}],
		answer: 'Michael'
	},
	allStoreEnhancers
);


ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
