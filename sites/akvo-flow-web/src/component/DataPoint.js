import React, { Component } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps } from '../reducers/actions.js'

class DataPoint extends Component {

    render() {
        return (
            <div className="data-point">
                <h3 className="data-point-name">{this.props.value.datapoint}</h3>
                <span className="text-center data-point-id">{this.props.value.uuid}</span>
            </div>
        );
    }
}

export default connect(mapStateToProps)(DataPoint);
