import React, { Component } from 'react';
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Filters extends Component {
    constructor(props) {
        super(props);
    }

    filterList (x) {
        this.props.setFilters(x, this.props.type)
        this.props.getFilteredList();
    }

    render() {
        let data = this.props.value[this.props.type];
        let selected = this.props.value.selected[this.props.type];
        return data.map((x, y) => {
            let variant = "primary";
            if (!selected.includes(x)) {
                variant = "secondary";
            }
            return (
                <Button variant={variant} key={y} className="btn-filter" onClick={event => this.filterList(x)}>
                    <span className="filter-text">{x}</span>
                        <div className="close-icon">
                        <FontAwesomeIcon icon={["fas", "times-circle"]} />
                        </div>
                </Button>
            );
        })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
