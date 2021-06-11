import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { translate } from  "../util/Languages";

class OverviewButton extends Component {
    constructor(props) {
        super(props);
        this.showOverview = this.showOverview.bind(this);
        this.listClass = "list-group-item list-group-item-action list-overview ";
    }

    showOverview() {
        this.props.showOverview(true);
    }

    render() {
        let activeClass = this.props.value.overview ? "bg-current" : "bg-light";
        activeClass = this.listClass + activeClass;
        return (
            <div className={"list-group list-group-flush"} key={"overview"}>
                <div
                    onClick={e => { this.showOverview(); }}
                    className={activeClass}
                >
            <span className="btn btn-block btn-outline-primary">{translate(this.props.value.lang.active, 'overviews')}</span>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OverviewButton);
