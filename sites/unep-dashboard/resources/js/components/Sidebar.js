import React, { Component, Fragment } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { flatten, reorderCountry, translateValue } from '../data/utils.js';
import  startsWith from 'lodash/startsWith';
import { Form, Badge, Col } from 'react-bootstrap';
import ToolTips from './ToolTips.js';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';

const getParent = (id, data, list=[]) => {
    let parent = data.find(x => x.id === id);
    if (parent.parent_id !== null){
        list.push(parent);
        return getParent(parent.parent_id, data, list);
    }
    list.push(parent);
    return list;
}
const li = "list-group-item list-group-item-action bg-light";


class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.renderFilters = this.renderFilters.bind(this);
        this.renderCount = this.renderCount.bind(this);
        this.changeFilters = this.changeFilters.bind(this);
        this.changeCountries = this.changeCountries.bind(this);
        this.resetFilterProps = this.resetFilterProps.bind(this);
        this.renderCountries = this.renderCountries.bind(this);
        this.searchItems = this.searchItems.bind(this);
        this.parentFilters = this.parentFilters.bind(this);
        this.state = {
            active:[1],
            searched: [],
            depth:0,
            parent_id:null
        };
    }

    findParent() {
        this.props.page.badge.store(results);
    }

    changeCountries(data, group) {
        this.props.data.toggle.countries(data, group);
    }

    changeFilters(id, depth){
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
            this.setState({active:active, depth:depth, parent_id:id, searched:[]});
        }
        return true;
    }

    resetFilterProps() {
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



    renderCountries() {
        let group = this.props.value.page.sidebar.group;
        let data = group
            ? this.props.value.page.countrygroups
            : this.props.value.page.countries;
        let active = false;
        let searched = reorderCountry(this.state.searched);
        if (searched.length > 0){
            data = searched;
        }
        return data.map(
            (x, i) => {
                let active = group
                    ? this.props.value.data.countrygroups.includes(x.id)
                    : this.props.value.data.countries.includes(x.id);
                return(
                    <li
                        key={x.id}
                        href="#"
                        className={li}
                    >
                        <div
                            className={active
                            ? "select-nested plus selected"
                            : "select-nested plus"}
                            onClick={e => this.changeCountries(x, group)}>
                        <FontAwesomeIcon
                            color={active ? "green" : "grey"}
                            icon={["fas", active ? "check-circle" : "plus-circle"]}
                        />
                        </div>
                        <div
                            className={active
                            ? "select-nested text selected"
                            : "select-nested text"}
                            onClick={e => this.changeCountries(x, group)}>
                            {x.name}
                        </div>
                        { group ? (<ToolTips tt={x} tclass="info-nested" tplacement="right"/>) : "" }
                    </li>
                )
            }
        )
    }

    parentFilters(id, childs=false) {
        if (!childs || childs.length === 0) {
            return this.props.data.toggle.filters(id);
        }
        return this.props.data.remove.filters(id, childs);
    }

    renderFilters(filters, depth, locale){
        let nest = depth + 1;
        return filters.map(
            (x, i) => {
                let active = this.props.value.data.filters.includes(x.id);
                let badges = this.props.value.page.badges;
                let hidden = !this.state.active.includes(x.id);
                let activeChilds = x.childrens.length > 0
                    ? x.childrens
                    : false;
                let totalActive = 0;
                let childIds = false;
                if (activeChilds) {
                    activeChilds = flatten(activeChilds).filter(x => x.childrens.length === 0);
                    activeChilds = activeChilds.map(x => x.id);
                }
                if (activeChilds && this.props.value.data.filters.length > 0) {
                    childIds = activeChilds.filter(x => this.props.value.data.filters.includes(x));
                    totalActive = childIds.length;
                    activeChilds = totalActive === activeChilds.length;
                } else {
                    activeChilds = false;
                }
                let text = translateValue(x, locale);
                return (
                <li
                    key={x.id}
                    href="#"
                    hidden={hidden}
                    className={li}
                >
                    {x.childrens.length > 0 ? (
                        <Fragment>
                            <div
                                className="prev-nested parent-text"
                                hidden={this.state.parent_id !== x.id}
                                onClick={e => this.resetFilterProps()}>
                                <FontAwesomeIcon
                                    color={"#007bff"}
                                    className="fas-icon"
                                    icon={["fas", "arrow-circle-left"]}/> Back
                            </div>

                            <div
                                className="select-nested"
                                hidden={this.state.depth !== depth}
                                onClick={e => this.parentFilters(x.id, childIds)}>
                                <FontAwesomeIcon
                                    color={activeChilds ? "green" : (totalActive > 0 ? "#e88d3f" : "grey")}
                                    icon={["fas", activeChilds ? "check-circle" : (totalActive > 0 ? "minus-circle" : "plus-circle")]}/ >
                            </div>
                            <div className="next-nested parent-text"
                                hidden={this.state.depth !== depth}
                                onClick={e => this.changeFilters(x.id, nest)}>
                                {text}
                                {this.renderCount(totalActive)}
                            </div>
                            <div className="next-nested arrows"
                                hidden={this.state.depth !== depth}
                                onClick={e => this.changeFilters(x.id, nest)}>
                                <FontAwesomeIcon
                                    icon={["fas", "arrow-circle-right"]} />
                            </div>
                            <ul className="list-group list-group-nested">
                                {this.renderFilters(x.childrens, nest, locale)}
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
                                {text}
                            </div>
                        </Fragment>
                    )}
                </li>
            )}
        )
    }

    searchItems(data) {
        this.setState({searched:[]})
        if (data === ""){
            return;
        }
        let keywords = data.target.value.toLowerCase().split(' ');
        let source = this.props.value.page;
        let selected = source.sidebar.selected;
        if (selected === "countries" && source.sidebar.group) {
            selected = "countrygroups";
        }
        source = source[selected];
        let results = source.map(x => {
            let score = 0;
            let names = x.name.toLowerCase();
            names = names.split(' ');
            names.forEach(x => {
                keywords.forEach(k => {
                    score += x.startsWith(k) ? 1 : 0;
                })
            });
            return {
                ...x,
                score: score
            }
        });
        results = results.filter(x => x.score > 0);
        this.setState({searched: results});
        return;
    }

    componentDidMount() {
        let active = this.props.value.page.filters.map(x => x.id);
        this.setState({active:active, depth:0, parent_id:null, searched:[]})
    }

    UNSAFE_componentWillReceiveProps() {
        let active = this.props.value.page.filters.map(x => x.id);
        this.setState({searched:[]});
        if (this.props.value.page.sidebar.selected !== "filters") {
            this.setState({depth:0});
        }
    }

    render() {
        let sidebar = this.props.value.page.sidebar;
        let lang = this.props.value.locale.lang;
        return (
            <div className="bg-light border-right" id="sidebar-wrapper">
                <div className="filter-search">
                    <Form.Row>
                    <Form.Group
                        as={Col}
                        md={sidebar.selected === "countries" ? "8" : "12"}
                        onChange={this.searchItems}
                        controlId="formGroupSearch">
                        <Form.Control
                            data-tour={"sidebar-search"}
                            type="input"
                            disabled={this.state.depth > 0}
                            placeholder={lang.search} />
                    </Form.Group>
                        {sidebar.selected === "countries" ? (
                            <Form.Group
                                as={Col}
                                md={"4"}
                                onChange={this.props.page.sidebar.switchgroup}
                                controlId="formGroupSwitch">
                            <Form.Check
                                defaultChecked={this.props.value.page.sidebar.group}
                                type="switch"
                                id="custom-switch"
                                label={lang.region}
                              />
                            </Form.Group>) : ""}
                    </Form.Row>
                </div>
              <ul className="list-group list-group-flush">
                  {sidebar.selected === "filters"
                    ? this.renderFilters(
                        this.state.searched.length === 0
                            ? this.props.value.page.filters
                            : this.state.searched
                        , 0, this.props.value.locale.active
                    ) : this.renderCountries()
                  }
              </ul>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
