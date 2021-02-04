import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import qs from 'qs';
require('dotenv').config()

const urlParams = qs.parse(document.location.search, {ignoreQueryPrefix: true});

if (urlParams.cache === "0") {
    localStorage.clear();
}

ReactDOM.render(<App /> , document.getElementById('root'));
serviceWorker.unregister();
