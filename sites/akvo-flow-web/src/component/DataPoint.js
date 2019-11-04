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
                    <FaThumbtack color="#9ea4a8" className="data-point-icon"/>
                    {this.props.value.datapoint}
                </h3>
                <span className="data-point-id">{this.props.value.uuid}</span>
            </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(DataPoint);
