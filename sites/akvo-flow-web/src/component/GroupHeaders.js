import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import React, { Component } from "react";
import Loading from "../util/Loading";
import Error from "../util/Error";
import { FaPlus, FaExclamationTriangle } from "react-icons/fa";

class GroupHeaders extends Component {
    constructor(props) {
        super(props);
        this.getHeader = this.getHeader.bind(this);
        this.getLoading = this.getLoading.bind(this);
        this.getRepeatButton = this.getRepeatButton.bind(this);
        this.cloneGroup = this.cloneGroup.bind(this);
    }

    cloneGroup(group, restoring){
        if (!this.props.value.pages.data._isLoading) {
            this.props.cloneGroup(group.index, restoring);
        }
    }

    getRepeatButton = (group) => {
        return (
            <button
                className={"btn btn-primary btn-repeatable"}
                onClick={(e => this.cloneGroup(group, false))}
            >
                Repeat Group <FaPlus/>
            </button>
        )
    }

    getHeader = groups => {
        let active = groups.list.filter(g => g.index === groups.active);
        return active.map((group, index) => (
            <nav className="navbar navbar-expand-lg navbar-light navbar-group bg-light border-bottom" key={"ghead-" + index}>
                <div className="col-md-4 header-left">
                    <h4 className="mt-2">{group.heading}</h4>
                </div>
                <div className="col-md-8 text-right">
                    <div className="badge-header">
                        <div className={"badge badge-left badge-secondary"}>
                            <FaExclamationTriangle /> Mandatory
                        </div>
                        <div className={"badge badge-right badge-red"}>{group.attributes.mandatories}</div>
                    </div>
                    { group.repeatable ? this.getRepeatButton(group) : "" }
                </div>
            </nav>
        ));
    };

    getLoading = () => {
        if (this.props.value.error) {
            return (<Error styles={"header-loading"} />);
        }
        return (<Loading styles={"header-loading"} />);
    }

    componentDidUpdate() {
        this.props.value.groups.list.forEach(x => {
            if (localStorage.getItem('G'+x.index)) {
                let clone = parseInt(localStorage.getItem('G'+x.index));
                console.log(clone);
                if (x.repeat !== clone) {
                    this.cloneGroup(x, true)
                }
                return clone;
            }
            return false;
        });
    }

    render() {
        return this.props.value.questions.length === 1 ? this.getLoading() : this.getHeader(this.props.value.groups);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupHeaders);
