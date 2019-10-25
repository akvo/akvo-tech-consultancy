import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
require('dotenv').config()

ReactDOM.render(<App /> , document.getElementById('root'));
serviceWorker.unregister();

window.onbeforeunload = function() {
   let dataType = localStorage.getItem("answerType");
   let photos = [];
   dataType.split(",").forEach(function(x, i) {
       if (x === "PHOTO") {
           photos.push(i);
       }
   });
   photos.forEach(function(x, i) {
       if(localStorage.getItem(x)){
           localStorage.removeItem(x);
       };
   });
   return "You have unsaved changes.";
};
