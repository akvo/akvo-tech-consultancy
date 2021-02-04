import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import React, { Component } from "react";
import { FaTrash } from "react-icons/fa";
import { SAVE_FEATURES } from "../util/Environment"
import { Locale } from  "../util/Languages"
import { getLocalization } from "../util/Utilities"

const useCustomInfo = (props) => {
    let registered = SAVE_FEATURES.find(x => x.instance === props.instanceName);
    if (registered) {
        registered = registered.skipMandatories.includes(props.surveyId);
    }
    if (registered) {
        const localization = getLocalization(props.lang.active, Locale.customRepeatGroupInfo, "span", "trans-lang");
        return (
            <div className="col-md-12 repeat-group-custom-intro" dangerouslySetInnerHTML={{__html:localization}}/>
        )
    }
    return "";
}

class GroupPanels extends Component {

    constructor(props) {
        super(props);
        this.removeGroup = this.removeGroup.bind(this);
    }

    removeGroup(data) {
        this.props.removeGroup(data);
        this.props.reduceGroups()
        this.props.checkSubmission()
    }

    render() {
        let data = this.props.data;
        let active = this.props.value.groups.active === data.group;
        let i = data.iteration + 1;
        if (this.props.type === "header" && active && data.groupIndex) {
            return (
                <div key={data.iteration} className={"text-center row"}>
                    <div className="col-md-5 repeat-group-line"><hr/></div>
                    <div className="col-md-2 repeat-group-header"> Repeat Group {i} </div>
                    <div className="col-md-5 repeat-group-line"><hr/></div>
                    {useCustomInfo(this.props.value)}
                </div>
            )
        }
        if (this.props.type === "footer" && active && data.last && i !== 1) {
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
