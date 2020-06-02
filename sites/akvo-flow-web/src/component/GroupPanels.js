import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import React, { Component } from "react";
import { FaPlus } from "react-icons/fa";


class GroupPanels extends Component {

    constructor(props) {
        super(props);
        this.cloneGroup = this.cloneGroup.bind(this);
    }

    cloneGroup = (group) => {
        this.props.cloneGroup(group.index)
        console.log(this.props);
        //this.props.cloneGroup(group.index)
    }

    render() {
        const groups = this.props.value.groups;
        let group = groups.list
            .filter(x => x.index === groups.active)
            .filter(x => x.repeatable);
        if (group.length === 0) {
            return "";
        }
        return (
            <div className={"align-center"}>
            <button
                className={"btn btn-primary btn-repeatable"}
                onClick={e => this.cloneGroup(group[0])}
            >
                Repeat Group <FaPlus />
            </button>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupPanels);
