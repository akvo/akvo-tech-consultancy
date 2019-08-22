import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getReport } from './actions/reportAction';
import { createSelector } from 'reselect';

class App extends Component {

    constructor(props) {
        super(props);
        this.onUpdateRsr = this.onUpdateRsr.bind(this)
    }

    render() {
        return (
            <div className={styles.base}>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(App);
