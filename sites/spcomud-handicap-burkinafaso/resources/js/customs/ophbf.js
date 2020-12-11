import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';

class OphBf extends Component {
    constructor(props) {
        super(props);
    }

    // TODO : Render chart here
    render() {
        return (
            <h1>Testing custom file</h1>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OphBf);