import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import {
    Container,
    Col,
    Card,
    Form,
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
        this.state = {
            autocomplete: false,
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

    renderCountryValues (x, depth) {
        let addcolumn = this.props.value.page.compare.add;
        if (this.props.value.page.compare.init) {
            return (
                <td key={"init-" + x.id} align="center" className="other-column">-</td>
            )
        }
        if (depth > 0 || x.childrens.length > 6) {
            let columns = this.props.value.page.compare.countries.map((country, ci) => {
                let indicator = this.props.value.data.master.find(x => x.country_id === country.country_id);
                let value = false;
                if (indicator){
                    value = indicator.values.find(i => i.id === x.id);
                }
                value = value ? value.datapoints.length : "-";
                return (
                    <td key={country.country_id + "-" + x.id} align="center" className="other-column">
                    {value}
                    </td>
                )
            });
            if (addcolumn) {
                columns.push(
                    <td key={"empty-value-" + x.id} align="center" className="other-column">-</td>
                )
            }
            return columns.map(x => x);
        }
        if (this.props.value.page.compare.countries.length === 0){
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
            const values = this.props.value.page.compare.countries.map((country) => {
                let indicator = this.props.value.data.master.find(c => c.country_id === country.country_id);
                let value = [];
                let nonglobal = 0;
                if (indicator){
                    value = indicator.values.filter(i => allchilds.includes(i.id));
                }
                if (value.length > 0) {
                    value = flatten(value.map(v => v.datapoints));
                    value = uniq(value);
                    nonglobal = intersection(value, individual);
                    nonglobal = nonglobal.length > 0 ? nonglobal.length : 0;
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
        let countries = [];
        this.props.value.page.compare.countries.forEach(c => {
            countries.push(c.name);
            if (this.props.value.data.global) {
                countries.push(c.name + ' (Shared)');
            }
        });
        const data = {
            legends: legends,
            xAxis: [{
                data: countries
            }],
            series: series,
        };
        let extra = {};
        if (addcolumn) {
            let right = this.props.value.page.compare.countries.length + 1;
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
        }
        let colSpan = this.props.value.page.compare.countries.length;
            colSpan = addcolumn ? colSpan + 1 : colSpan;
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
                    {this.renderCountryValues(x, depth)}
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
        this.props.page.compare.addcountry(id);
        return;
    }

    renderSearchItem() {
        return this.state.searched.map((x,i) => {
            return (
                <div
                    onClick={e => this.appendColumn(x.id)}
                    className="search-suggest"
                    key={'country-' + x.code}>
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
        let source = this.props.value.page.countries;
        let selected = this.props.value.page.compare.countries;
        if (selected.length > 0) {
            selected = selected.map(x => x.country_id);
            source = source.filter(x => {
                return !selected.includes(x.id)
            });
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

    renderSearch() {
        let items = this.props.value.page.countries.map(x => {
            return {label: x.name,value: x.name}
        });
        return (
            <td key={"header-add"} className="first-column header-country" align="center">
                <Card className="card-add-column">
                    <Card.Body className="card-compare">
                        <Form>
                          <Form.Group
                              onChange={this.changeSearchItem}
                              controlId="formSearchCountry">
                            <Form.Control type="text" placeholder="Enter Keyword" />
                            {this.state.searched.length !== 0 ? (
                                <div className="search-item-bar">{this.renderSearchItem()}</div>
                            ) : ""}
                          </Form.Group>
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
        let addcolumn = this.props.value.page.compare.add;
        let countries = this.props.value.page.compare.countries;
        if (countries.length > 0) {
            countries = countries.map(x => {
                return(
                    <td key={"header-"+x.country_id} className="first-column header-country" align="center">
                        <Card>
                            { addcolumn ? (
                                <FontAwesomeIcon
                                    onClick={e => this.props.page.compare.removecountry(x.country_id)}
                                    className="fas-corner fas-delete"
                                    color="red"
                                    icon={["fas", "times-circle"]} />
                            ) : "" }
                            <Card.Body className="card-compare">
                                <h5>{x.name}</h5>
                            </Card.Body>
                        </Card>
                    </td>
                )
            });
        }
        if (addcolumn) {
            let headerAdd = !autocomplete ? (
                <td key={"header-add"} className="first-column header-country" align="center">
                    <Card
                        onClick={e => this.toggleAutoComplete(true)}
                        className="card-add-column">
                        <Card.Body className="card-compare">
                            <FontAwesomeIcon color="grey" icon={["fas", "plus-circle"]} />
                            <br/>
                            Add Country
                        </Card.Body>
                    </Card>
                </td>
            ) : this.renderSearch();
            countries = [...countries, headerAdd]
        }
        return countries;
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
