import React, { Component } from 'react';
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";

class Filters extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>Filter</div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
