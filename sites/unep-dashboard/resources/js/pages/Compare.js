import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import {
    Container,
    Col,
    Card,
    Form,
    InputGroup,
    Row
} from 'react-bootstrap';
import Charts from "../components/Charts";
import { getAllChildsId, formatCurrency } from '../data/utils.js';
import { generateData } from "../data/chart-utils.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import  startsWith from 'lodash/startsWith';
import intersection from 'lodash/intersection';

const parentStyle = {
    fontWeight:"bold",
    backgroundColor:"#f1f1f5",
    paddingLeft: "10px"
}

const chevron = (active, depth) => {
    if (depth !== 0) {
        return <FontAwesomeIcon
            className="expand-row-icon"
            color={"grey"} icon={["fas", active ? "chevron-down" : "chevron-right"]}
        />
    }
    return "";
}

class Compare extends Component {
    constructor(props) {
        super(props);
        this.renderIndicator = this.renderIndicator.bind(this);
        this.renderTableHeader = this.renderTableHeader.bind(this);
        this.renderSearch = this.renderSearch.bind(this);
        this.renderSearchItem = this.renderSearchItem.bind(this);
        this.changeSearchItem = this.changeSearchItem.bind(this);
        this.appendColumn = this.appendColumn.bind(this);
        this.toggleAutoComplete = this.toggleAutoComplete.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
        this.toggleGroup = this.toggleGroup.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.state = {
            autocomplete: false,
            selectgroup: false,
            searched: [],
            expanded: [],
            excluded: [1]
        }
    }

    toggleExpand(id) {
        let expanded = this.state.expanded;
        if (expanded.includes(id)) {
            expanded = expanded.filter(x => x !== id);
            this.setState({expanded: expanded});
            return;
        }
        this.setState({expanded: [...expanded, id]});
    }

    renderItemValues (x, depth) {
        if (this.props.value.page.compare.init) {
            return (
                <td key={"init-" + x.id} align="center" className="other-column">-</td>
            )
        }
        if (depth > 0 || x.childrens.length > 6) {
            let columns = this.props.value.page.compare.items.map((item, ci) => {
                let indicator = false;
                let value = false;
                if (item.itemtype === "countries") {
                    indicator = this.props.value.data.master.find(m => m.country_id === item.id);
                    if (indicator){
                        value = indicator.values.find(i => i.id === x.id);
                    }
                    value = value ? value.datapoints.length : "-";
                }
                if (item.itemtype === "countrygroups") {
                    let itemlist = this.props.value.page.countries.filter(c => {
                        let groupids = c.groups.map(g => g.id);
                        return groupids.includes(item.id);
                    });
                    itemlist = itemlist.map(i => i.id);
                    indicator = this.props.value.data.master.filter(m => itemlist.includes(m.country_id));
                    indicator = indicator.map(i => {
                        let vs = i.values.find(v => v.id === x.id);
                        vs = vs ? vs : false;
                        return vs;
                    });
                    indicator = indicator.filter(i => i);
                    indicator = indicator.map(i => i.datapoints);
                    indicator = uniq(flatten(indicator));
                    value = indicator.length;
                }
                return (
                    <td key={item.id + "-" + x.id} align="center" className="other-column">{value}</td>
                )
            });
            columns.push(<td key={"empty-value-" + x.id} align="center" className="other-column">-</td>)
            return columns.map(x => x);
        }
        if (this.props.value.page.compare.items.length === 0){
            return (<td align="center"> - </td>);
        }
        const legends = x.childrens.map(child => {
            let name = child.name.split('(')[0];
                name = name.split(':')[0];
            return name;
        });
        const individual = this.props.value.data.datapoints.filter(d => d.global === false).map(d => d.datapoint_id);
        const series = x.childrens.map(child => {
            let name = child.name.split('(')[0];
                name = name.split(':')[0];
            const allchilds = getAllChildsId(child, []);
            const values = this.props.value.page.compare.items.map((item) => {
                let indicator = false;
                let value = [];
                let nonglobal = 0;
                if (item.itemtype === "countries") {
                    indicator = this.props.value.data.master.find(c => c.country_id === item.id);
                    if (indicator){
                        value = indicator.values.filter(i => allchilds.includes(i.id));
                    }
                    if (value.length > 0) {
                        value = uniq(flatten(value.map(v => v.datapoints)));
                    }
                    if (value.length > 0) {
                        nonglobal = intersection(value, individual);
                        nonglobal = nonglobal.length > 0 ? nonglobal.length : 0;
                    }
                }
                if (item.itemtype === "countrygroups") {
                    let itemlist = this.props.value.page.countries.filter(c => {
                        let groupids = c.groups.map(g => g.id);
                        return groupids.includes(item.id);
                    });
                    itemlist = itemlist.map(i => i.id);
                    indicator = this.props.value.data.master.filter(m => itemlist.includes(m.country_id));
                    indicator = indicator.map(i => {
                        let vs = i.values.filter(i => allchilds.includes(i.id));
                        vs = vs.length > 0 ? vs : false;
                        return vs;
                    });
                    indicator = indicator.filter(i => i);
                    indicator = flatten(indicator);
                    indicator = indicator.map(i => i.datapoints);
                    value = uniq(flatten(indicator));
                    if (value.length > 0) {
                        nonglobal = value.filter(v => {
                            let countrylist = this.props.value.data.master.filter((m, i) => {
                                let datapoints = m.values.map(d => d.datapoints);
                                    datapoints = flatten(datapoints)
                                return datapoints.includes(v);
                            });
                            countrylist = countrylist.map(c => c.country_id);
                            countrylist = this.props.value.page.countries.filter(c => countrylist.includes(c.id));
                            countrylist = countrylist.filter(c => {
                                let cgroups = c.groups.map(g => g.id);
                                return !cgroups.includes(item.id);
                            });
                            return countrylist.length === 0;
                        });
                        nonglobal = nonglobal.length > 0 ? nonglobal.length : 0;
                    }
                }
                if (this.props.value.data.global) {
                    return value.length > 0 ? [nonglobal, value.length] : [nonglobal, 0];
                }
                return [nonglobal];
            });
            return {
                name: name,
                type: 'bar',
                stack: 'category',
                data: flatten(values),
                barMaxWidth: '50px',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(220, 220, 225, 0.1)'
                }
            };
        });
        let items = [];
        this.props.value.page.compare.items.forEach(c => {
            items.push(c.name);
            if (this.props.value.data.global) {
                items.push(c.name + ' (Shared)');
            }
        });
        const data = {
            legends: legends,
            xAxis: [{
                data: items
            }],
            series: series,
        };
        let extra = {};
        let right = this.props.value.page.compare.items.length + 1;
            right = 100 / right;
            right = right + "%";
        extra = {
            grid: {
                top: "23px",
                left: "auto",
                right: right,
                bottom: "25px",
                borderColor: "#ddd",
                borderWidth: .5,
                show: true,
                label: {
                    color: "#222",
                    fontFamily: "Assistant",
                }
            }
        }
        let colSpan = this.props.value.page.compare.items.length + 1;
        return (
            <td key={'parent-table' + x.id} colSpan={colSpan} className={"chart-display"}>
                <Charts
                    title={''}
                    subtitle={''}
                    kind={'BARSTACK'}
                    config={generateData(0, false, "50vh")}
                    dataset={data}
                    extra={extra}
                />
            </td>
        )
    }

    renderIndicator(data, depth) {
        let padding = depth === 0 ? 0 : (30*depth);
        let fontSize = depth === 0 ? 14 : 12;
        let styleBase = {paddingLeft: padding + "px",fontSize: fontSize + "px"};
            styleBase = depth === 0 ? {...styleBase, ...parentStyle} : styleBase;
        let nest = depth + 1;
        data = data.filter(x => !this.state.excluded.includes(x.id));
        return data.map((x, i) => {
            let name = x.name.split('(')[0];
            let active = this.state.expanded.includes(x.id) || nest === 1;
            let className = x.childrens.length > 0 ? "first-column expand-row" : "first-column";
            let parent = [(
                <tr key={x.id + "-" + depth}>
                    <td onClick={e => this.toggleExpand(x.id)} className={className} style={styleBase}>
                        {x.childrens.length > 0 ? chevron(active, depth) : ""} {name}
                    </td>
                    {this.renderItemValues(x, depth)}
                </tr>
            )];
            if (x.childrens.length > 0 && active) {
                parent.push(this.renderIndicator(x.childrens, nest));
            };
            return parent;
        });
    }

    appendColumn(id) {
        this.setState({searched:[], autocomplete: false});
        let itemtype = this.state.selectgroup ? "countrygroups" : "countries";
        this.props.page.compare.additem(id, itemtype);
        return;
    }

    renderSearchItem() {
        return this.state.searched.map((x,i) => {
            return (
                <div
                    onClick={e => this.appendColumn(x.id)}
                    className="search-suggest"
                    key={'item-' + x.id + '-' + x.code}>
                    {x.name}
                </div>
            )
        });
    }

    changeSearchItem(e) {
        this.setState({searched:[]})
        if (e.target.value === ""){
            return;
        }
        let keywords = e.target.value.toLowerCase().split(' ');
        let itemtype = this.state.selectgroup ? "countrygroups" : "countries";
        let source = this.props.value.page[itemtype];
        let selected = this.props.value.page.compare.items;
        if (selected.length > 0) {
            selected = selected.map(x => x.id);
            source = source.filter(x => !selected.includes(x.id));
        }
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

    toggleDropDown() {
        if (this.state.searched.length > 0) {
            this.setState({searched: []});
            return;
        }
        let itemtype = this.state.selectgroup ? "countrygroups" : "countries";
        let results = this.props.value.page[itemtype].map(x => {
            return {
                id: x.id,
                name: x.name
            }
        });
        this.setState({searched: results});
        return;
    }

    toggleGroup() {
        let selectgroup = this.state.selectgroup ? false : true;
        let results = [];
        if (this.state.searched.length > 0) {
            let itemtype = selectgroup ? "countrygroups" : "countries";
            results = this.props.value.page[itemtype].map(x => {
                return {
                    id: x.id,
                    name: x.name
                }
            });
        }
        this.setState({selectgroup: selectgroup, searched: results})
    }

    removeDropDown() {
        this.setState({searched:[]})
    }

    renderSearch() {
        let itemtype = this.state.selectgroup ? "countrygroups" : "countries";
        let items = this.props.value.page[itemtype].map(x => {
            return {label: x.name,value: x.name}
        });
        return (
            <td key={"header-add"} className="first-column header-country" align="center">
                <Card className="card-add-column card-autocomplete">
                    <Card.Body className="card-compare">
                        <Form>
                            <InputGroup size="sm">
                                <InputGroup.Prepend className="compare-group-switcher-container">
                                    <InputGroup.Text>
                                        <Form.Group
                                            className="compare-group-switcher"
                                            onChange={this.toggleGroup}
                                            controlId="compareType">
                                        <Form.Check
                                            type="switch"
                                            defaultChecked={this.state.selectgroup}
                                            label="Group"
                                            />
                                        </Form.Group>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    onClick={e => this.toggleDropDown()}
                                    onChange={this.changeSearchItem}
                                    type="text"
                                    placeholder="Enter Keyword" />
                                <InputGroup.Append>
                                    <InputGroup.Text
                                        onClick={e => this.toggleDropDown()}
                                        className={this.state.searched.length > 0
                                        ? "dropdown-select close"
                                        : "dropdown-select"
                                    }>
                                    <FontAwesomeIcon
                                        color={this.state.searched.length > 0 ? "red" : "grey"}
                                        icon={["fas", this.state.searched.length > 0
                                            ? "times-circle"
                                            : "chevron-circle-down"
                                        ]} />
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                            {this.state.searched.length !== 0 ? (
                                <div className="search-item-bar">{this.renderSearchItem()}</div>
                            ) : ""}
                        </Form>
                    </Card.Body>
                </Card>
            </td>
        )
    }

    toggleAutoComplete(bool) {
        this.setState({autocomplete:true});
    }

    renderTableHeader(autocomplete) {
        let items = this.props.value.page.compare.items;
        if (items.length > 0) {
            items = items.map(x => {
                return(
                    <td key={"header-"+x.id} className="first-column header-country" align="center">
                        <Card>
                            <FontAwesomeIcon
                                onClick={e => this.props.page.compare.removeitem(x.id, x.itemtype)}
                                className="fas-corner fas-delete"
                                color="red"
                                icon={["fas", "times-circle"]} />
                            <Card.Body className="card-compare">
                                <h5>{x.name}</h5>
                            </Card.Body>
                        </Card>
                    </td>
                )
            });
        }
        let headerAdd = !autocomplete ? (
            <td key={"header-add"} className="first-column header-country" align="center">
                <Card
                    onClick={e => this.toggleAutoComplete(true)}
                    className="card-add-column">
                    <Card.Body className="card-compare">
                        <FontAwesomeIcon color="grey" icon={["fas", "plus-circle"]} />
                        <br/>
                        Add New
                    </Card.Body>
                </Card>
            </td>
        ) : this.renderSearch();
        items = [...items, headerAdd]
        return items;
    }

    render() {
        let autocomplete = this.state.autocomplete;
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <div className="table-wrapper-fixed">
                        <table width={"100%"} className="table-compare">
                            <thead>
                                <tr>
                                    <td align="left" width={"30%"} className="first-column"></td>
                                    {this.renderTableHeader(autocomplete)}
                                </tr>
                            </thead>
                            <tbody>{this.renderIndicator(this.props.value.page.filters, 0)}</tbody>
                        </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
