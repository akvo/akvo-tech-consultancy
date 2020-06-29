import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { titleCase } from "../data/utils.js";
import {
    ButtonGroup,
    Button
} from 'react-bootstrap';

class DataTypes extends Component {
    constructor(props) {
        super(props);
        this.renderButton = this.renderButton.bind(this);
        this.changeValueName = this.changeValueName.bind(this);
    }

    changeValueName(valueName) {
        this.props.filter.valtype.change(valueName);
    }

    renderButton(status, buttons) {
        return buttons.map((name,index) => {
            let title = name === "reset" ? "Reset Filters" : titleCase(name);
            let variant = status === name ? "primary" : "secondary";
            return (
                <Button
                    onClick={e => this.changeValueName(name)}
                    key={"btn-type-" + index}
                    variant={name === "reset" ? "primary" : variant}
                    className={name === "reset" ? "button-reset" : ""}
                >
                    {title}
                </Button>
            );
        });
    }

    render() {
        let status = this.props.value.filters.selected.type;
        // let buttons = ["new","quantity","total","reset"];
        let buttons = ["reset"];
        return (
            <ButtonGroup aria-label="DataTypes">
                {this.renderButton(status,buttons)}
            </ButtonGroup>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataTypes);
