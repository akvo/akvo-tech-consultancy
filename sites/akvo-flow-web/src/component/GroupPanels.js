import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import React, { Component } from "react";
import { FaTrash } from "react-icons/fa";


class GroupPanels extends Component {

    constructor(props) {
        super(props);
        this.removeGroup = this.removeGroup.bind(this);
    }

    removeGroup(data) {
        this.props.removeGroup(data);
    }

    render() {
        let data = this.props.data;
        let active = this.props.value.groups.active === data.group;
        let i = data.iteration + 1;
        if (active && data.groupIndex) {
            return (
                <div key={data.iteration} className={"text-center row"}>
                    <div className="col-md-5 repeat-group-line"><hr/></div>
                    <div className="col-md-2 repeat-group-header"> Repeat Group {i} </div>
                    <div className="col-md-5 repeat-group-line"><hr/></div>
                </div>
            )
        }
        if (active && data.last && i !== 1) {
            return (
                <div key={data.iteration} className={"text-center repeat-group-delete"}>
                    <button
                        className="btn btn-danger btn-repeatable"
                        onClick={e => this.removeGroup(data)}
                    >
                        <FaTrash/> Delete Repeat Group {i}
                    </button>
                </div>
            )
        }
        return "";
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupPanels);
