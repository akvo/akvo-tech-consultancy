import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps} from '../reducers/actions';
import { Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class ToolTips extends Component {

    constructor(props) {
        super(props);
        this.renderList = this.renderList.bind(this);
        this.renderPopOver = this.renderPopOver.bind(this);
    }

    renderList () {
        let selected = this.props.tt;
        let countries = this.props.value.page.countries.filter(x => {
            let group  = x.groups.map(g => g.id);
            return group.includes(selected.id);
        });
        countries = countries.map(x => (<li key={"countrytooltip-" + x.id}>{x.name}</li>));
        return (
            <Tooltip>
                <div className="left-align">
                <ul className="tooltip-list">{countries}</ul>
                </div>
            </Tooltip>
        );
    }

    renderPopOver () {
        let selected = this.props.tt;
        let countries = this.props.value.page.countries.filter(x => {
            let group  = x.groups.map(g => g.id);
            return group.includes(selected.id);
        });
        countries = countries.map(x => (<li key={"countrytooltip-" + x.id}>{x.name}</li>));
        return (
            <Popover>
            <Popover.Title as="h3">{selected.name}</Popover.Title>
            <Popover.Content>
                <div className="left-align">
                <ul className="tooltip-list">{countries}</ul>
                </div>
            </Popover.Content>
            </Popover>
        )
    }

    render() {
        return(
            <OverlayTrigger placement={this.props.tplacement} overlay={this.renderPopOver()}>
                <div className={this.props.tclass}>
                    <FontAwesomeIcon
                        color={"#007bff"}
                        icon={["fas", "info-circle"]}
                    />
                </div>
            </OverlayTrigger>
        )
    }

}

export default connect(mapStateToProps)(ToolTips);
