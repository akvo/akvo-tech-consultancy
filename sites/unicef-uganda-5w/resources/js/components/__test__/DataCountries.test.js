import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { states } from '../../reducers/reducers.js'
import logger from "redux-logger";

/*
 * Misc Dependencies
 */

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fab, fas)


/*
 * The components to be tested
 */

import DataCountries from '../DataCountries';

/*
 * State Provider
 * Mandatory
 */

const store = createStore(states, applyMiddleware(logger));

it("Going to have data country dropdown", () => {
    const div = document.createElement("div");
    const countries = state.states.filters.countries;
    ReactDOM.render(
        <Provider store={store}><DataCountries data={countries}/></Provider>
    , div);
})
