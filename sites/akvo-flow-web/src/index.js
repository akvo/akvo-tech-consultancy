import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
require('dotenv').config()

if (localStorage.getItem("questionId")){
    let qlcache = localStorage.getItem("questionId").split(",");
    let atcache = localStorage.getItem("answerType").split(",");
    let photocache = qlcache.map((x,i) => {
        return {id: x, type: atcache[i]}
    }).filter(x => x.type === "PHOTO");
    if (photocache.length > 0) {
        photocache.forEach(x => localStorage.removeItem(x.id))
    };
}
ReactDOM.render(<App /> , document.getElementById('root'));
serviceWorker.unregister();
