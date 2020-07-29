import React, { Component, Fragment } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { flatten } from '../data/utils.js';
import { Form } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';

const getParent = (id, data, list=[]) => {
    let parent = data.find(x => x.id === id);
    if (parent.parent_id !== null){
        list.push(parent);
        return getParent(parent.parent_id, data, list);
    }
    list.push(parent);
    return list;
}


class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.renderFilters = this.renderFilters.bind(this);
        this.renderCount = this.renderCount.bind(this);
        this.changeProps = this.changeProps.bind(this);
        this.resetProps = this.resetProps.bind(this);
        this.state = {
            active:[1],
            depth:0,
            parent_id:null
        };
    }

    findParent() {
        this.props.page.badge.store(results);
    }

    changeProps(id, depth){
        let data = flatten(this.props.value.page.filters);
        let it = data.find(x => x.id === id);
        if (it.childrens.length > 0) {
            let active = it.childrens.map(x => x.id);
            active.push(id);
            if (it.parent_id){
                active.push(it.parent_id);
                let allParents = getParent(it.parent_id, data);
                if (allParents.length > 0){
                    allParents = allParents.map(x => x.id);
                    active = [...active, ...allParents];
                }
            }
            this.setState({active:active, depth:depth, parent_id:id});
        }
        return true;
    }

    resetProps() {
        let active = this.props.value.page.filters.map(x => x.id);
        this.setState({active:active, depth:0, parent_id:null})
    }

    renderCount(number) {
        return number ? (
            <Badge
                className="sidebar-badge"
                variant="dark">
                {number}
            </Badge>
        ) : "";
    }


    renderFilters(filters, depth){
        let nest = depth + 1;
        let li = "list-group-item list-group-item-action bg-light";
        return filters.map(
            (x, i) => {
                let active = this.props.value.data.filters.includes(x.id);
                let badges = this.props.value.page.badges;
                badges = badges.find(b => b.id === x.id);
                badges = badges ? badges.count : false;
                return (
                <li
                    key={x.code}
                    href="#"
                    hidden={!this.state.active.includes(x.id)}
                    className={li}
                >
                    {x.childrens.length > 0 ? (
                        <Fragment>
                            <div
                                className="prev-nested parent-text"
                                hidden={this.state.parent_id !== x.id}
                                onClick={e => this.resetProps()}>
                                <FontAwesomeIcon
                                    color={"#007bff"}
                                    className="fas-icon"
                                    icon={["fas", "arrow-circle-left"]}/> Back
                            </div>

                            <div className="next-nested parent-text"
                                hidden={this.state.depth !== depth}
                                onClick={e => this.changeProps(x.id, nest)}>
                                {x.name}
                                {this.renderCount(badges)}
                            </div>
                            <div className="next-nested arrows"
                                hidden={this.state.depth !== depth}
                                onClick={e => this.changeProps(x.id, nest)}>
                                <FontAwesomeIcon
                                    icon={["fas", "arrow-circle-right"]} />
                            </div>
                            <ul className="list-group list-group-nested">
                                {this.renderFilters(x.childrens, nest)}
                            </ul>
                        </Fragment>
                    ) : (<Fragment>
                            <div
                                onClick={e => this.props.data.toggle.filters(x.id)}
                                className={active ? "select-nested plus selected" : "select-nested plus"}>
                            <FontAwesomeIcon
                                color={active ? "green" : "grey"}
                                icon={["fas", active ? "check-circle" : "plus-circle"]}
                            />
                            </div>
                            <div
                                className={active ? "select-nested text selected" : "select-nested text"}
                                onClick={e => this.props.data.toggle.filters(x.id)}>
                                {x.name}
                            </div>
                        </Fragment>
                    )}
                </li>
            )}
        )
    }

    componentDidMount() {
        let active = this.props.value.page.filters.map(x => x.id);
        this.setState({active:active, depth:0, parent_id:null})
    }

    render() {
        let filters = this.props.value.page.filters;
        return (
            <div className="bg-light border-right" id="sidebar-wrapper">
                <div className="filter-search">
                    <Form.Group controlId="formGroupSearch">
                        <Form.Control type="email" placeholder="Search" />
                    </Form.Group>
                </div>
              <ul className="list-group list-group-flush">
                  {this.props.value.page.loading ? "" : this.renderFilters(filters, 0)}
              </ul>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
