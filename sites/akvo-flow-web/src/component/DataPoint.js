import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps } from '../reducers/actions.js'
import {
    FaThumbtack,
} from 'react-icons/fa'

class DataPoint extends Component {

    render() {
        return (
            <Fragment>
            <div className="data-point">
                <h3 className="data-point-name">
                    {this.props.value.datapoint}
                </h3>
                <span className="data-point-id">{this.props.value.uuid}</span>
            </div>
            <FaThumbtack color="#495057" className="data-point-icon"/>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(DataPoint);
