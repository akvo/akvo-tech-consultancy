import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions.js";
import React, { Component } from "react";
import Loading from "../util/Loading";

class GroupButtons extends Component {
    constructor(props) {
        super(props);
        this.showQuestion = this.showQuestion.bind(this);
        this.getQuestionList = this.getQuestionList.bind(this);
        this.listClass = "list-group-item list-group-item-action ";
        this.state = {
            _showQuestion: ""
        };
    }

    showQuestion(group) {
        this.props.showOverview(false);
        this.props.changeGroup(group);
    }

    getQuestionList(groups) {
        return groups.list.map((group, i) => {
            let localization = this.props.value.lang.active;
            localization = localization.map((x) => {
                let active = group.lang[x] === undefined ? "" : group.lang[x];
                return active;
            });
            localization = localization.map((x, ix) => {
                let activeLang = ix !== 0
                    ? ("<b>" + this.props.value.lang.active[ix] + ": </b>")
                    : "";
                let extraClass = ix !== 0 ? " class='trans-lang-group'>" : ">";
                return "<span" + extraClass + activeLang + x + "</span>";
            });
            let groupName = localization.length > 1 ? localization.join("") : localization[0];
            let show = this.props.value.groups.list[i].attributes.questions !== 0 ? "" : "hidden";
            return (
            <div className={"list-group list-group-flush " + show} key={"group-" + group.index}>
                <div
                    onClick={e => {
                        this.showQuestion(group.index);
                    }}
                    className={group.index === groups.active && !this.props.value.overview
                        ? this.listClass + " bg-current"
                        : this.listClass + " bg-light"
                    }
                >
                    <span className="question-group-button" dangerouslySetInnerHTML={{__html:groupName}}/>
                    <span className={"badge badge-group badge-left badge-secondary"}>{this.props.value.groups.list[i].attributes.answers}</span>
                    <span className={"badge badge-group badge-right " + this.props.value.groups.list[i].attributes.badge}>{this.props.value.groups.list[i].attributes.questions}</span>
                </div>
            </div>
        );
        });
    }

    getLoading = () => <Loading styles={"sidebar-loading"} />;
    render() {
        return this.props.value.questions.length === 1 ? this.getLoading() : this.getQuestionList(this.props.value.groups);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupButtons);
