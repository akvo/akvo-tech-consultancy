import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    ButtonGroup,
    Button
} from 'react-bootstrap';

class DataTypes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let status = this.props.value.filters.selected.type;
        return (
            <ButtonGroup aria-label="DataTypes">
                <Button variant={status === "achived" ? "primary" : "secondary"}>Achived</Button>
                <Button variant={status === "planned" ? "primary" : "secondary"}>Planned</Button>
            </ButtonGroup>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataTypes);
