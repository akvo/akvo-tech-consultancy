import React, { Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import OverviewQuestion from './OverviewQuestion.js';
import { Card, CardBody, CardTitle } from "reactstrap";
import { FaPrint } from "react-icons/fa";

class Overview extends Component {
    constructor(props) {
        super(props);
        this.renderGroups = this.renderGroups.bind(this);
        this.renderRepeatGroup = this.renderRepeatGroup.bind(this);
        this.renderRepeatHeading = this.renderRepeatHeading.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.printOverview = this.printOverview.bind(this);
    }

    printOverview() {
        console.log('print!');
    }

    renderRepeatHeading(name, it) {
        return (<div><strong>{name + "-" + (it + 1)}</strong></div>);
    }

    renderRepeatGroup(group) {
        let groups = [];
        let repeat_ix = 0;
        let iter;
        do {
            iter = '-' + repeat_ix;
            let qgroup = [];
            for (let ix = 0; ix < group.questions.length; ix++) {
                qgroup[ix] = <OverviewQuestion key={group.questions[ix]} index={ix} group={group} iter={iter} qid={group.questions[ix]}/>;
            }
            groups.push({
                heading: this.renderRepeatHeading(group.heading, repeat_ix),
                content: qgroup
            });
            repeat_ix ++;
        } while(repeat_ix < group.repeat);
        return groups.map((x,i) => {
            if (i === groups.length - 1) {
                return (
                    <div key={i}>{x.heading}{x.content}</div>
                )
            }
            return (
                <div key={i}>{x.heading}{x.content}<hr/></div>
            )
        });
    }

    renderQuestions(group) {
        let iter = '-0'
        if (group.repeatable) {
            return this.renderRepeatGroup(group);
        }
        return group.questions.map((qid, ix) => {
            return (<OverviewQuestion index={ix} key={qid} group={group} iter={iter} qid={qid}/>)
        });
    }

    renderGroups() {
        return this.props.value.groups.list.map((group,i) => (
            <Card key={"og-" + i} id={"overview-group-" + i}>
                <CardBody>
                    <CardTitle>
                        <h5>{group.heading}</h5>
                    </CardTitle>
                    {this.renderQuestions(group, i)}
                </CardBody>
            </Card>
        ));
    }

    render() {
        return (
            <Fragment>
            <nav className="navbar navbar-expand-lg navbar-light navbar-group bg-light border-bottom" key="overview-group">
                <div className="col-md-4 header-left">
                    <h4 className="mt-2">Overviews</h4>
                </div>
                <div className="col-md-8 text-right">
                    <button
                        className={"btn btn-primary btn-repeatable hidden"}
                        onClick={(e => this.printOverview())}
                    >
                        Print <FaPrint/>
                    </button>
                </div>
            </nav>
            <div className="container-fluid fixed-container" key={'overview-containers'}>
                    {this.renderGroups()}
            </div>
            </Fragment>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
