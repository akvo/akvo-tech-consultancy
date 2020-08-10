import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import {
    Container,
    Col,
    Card,
    Row
} from 'react-bootstrap';
import Charts from "../components/Charts";
import { getAllChildsId, formatCurrency } from '../data/utils.js';
import { generateData } from "../data/chart-utils.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';

const parentStyle = {
    fontWeight:"bold",
    backgroundColor:"#f2f2f2",
    paddingLeft: "10px"
}

class Compare extends Component {
    constructor(props) {
        super(props);
        this.renderIndicator = this.renderIndicator.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
        this.state = {
            expanded: [],
            countrylist: [
                {country_id: 98, name: "Indonesia"},
                {country_id: 99, name: "India"},
                {country_id: 10, name: "Argentina"},
            ],
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
        if (depth > 0 || x.childrens.length > 6) {
            return this.state.countrylist.map((country, ci) => {
                let indicator = this.props.value.data.master.find(x => x.country_id === country.country_id);
                let value = indicator.values.find(i => i.id === x.id);
                value = value ? value.datapoints.length : "-";
                return (
                    <td key={country.country_id + "-" + x.id} align="center">
                    {value}
                    </td>
                )
            });
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
            const values = this.state.countrylist.map((country) => {
                let indicator = this.props.value.data.master.find(c => c.country_id === country.country_id);
                let value = indicator.values.filter(i => allchilds.includes(i.id));
                let nonglobal = 0;
                if (value.length > 0) {
                    value = flatten(value.map(v => v.datapoints));
                    value = uniq(value);
                    nonglobal = intersection(value, individual);
                    nonglobal = nonglobal.length > 0 ? nonglobal.length : 0;
                }
                if (this.props.value.data.global) {
                    return value.length > 0 ? [nonglobal, value.length] : [nonglobal, 0];
                }
                return value.length > 0 ? [value.length] : [0];
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
        this.state.countrylist.forEach(c => {
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
        return (
            <td key={'parent-table' + x.id} colSpan={3} className={"chart-display"}>
                <Charts
                    title={''}
                    subtitle={''}
                    kind={'BARSTACK'}
                    config={generateData(0, false, "50vh")}
                    dataset={data}
                    extra={{}}
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
        return data.map((x, i) => {
            if (this.state.excluded.includes(x.id)){
                return "";
            }
            let name = x.name.split('(')[0];
            let active = this.state.expanded.includes(x.id) || nest === 1;
            let className = x.childrens.length > 0 ? "first-column expand-row" : "first-column";
            let parent = [(
                <tr key={x.id + "-" + depth}>
                    <td
                        onClick={e => this.toggleExpand(x.id)}
                        className={className}
                        style={styleBase}>
                        { x.childrens.length > 0 ? (
                            <FontAwesomeIcon
                                className="expand-row-icon"
                                color={"grey"}
                                icon={["fas", active ? "chevron-down" : "chevron-right"]} />
                        ) : ""} {name}</td>
                    {this.renderCountryValues(x, depth)}
                </tr>
            )];
            if (x.childrens.length > 0 && active) {
                parent.push(this.renderIndicator(x.childrens, nest));
            };
            return parent;
        });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <table width={"100%"} className="table-compare">
                            <thead>
                                <tr>
                                    <td align="left" width={"30%"} className="first-column">
                                    </td>
                                    <td className="first-column" align="center">
                                        <Card>
                                            <Card.Body>
                                                <button className="btn btn-secondary btn-sm">
                                                <FontAwesomeIcon
                                                    className="fas-icon"
                                                    icon={["fas", "plus-circle"]} />
                                                 Add Country
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    </td>
                                    <td className="first-column" align="center">
                                        <Card>
                                            <Card.Body>
                                                <button className="btn btn-secondary btn-sm">
                                                <FontAwesomeIcon
                                                    className="fas-icon"
                                                    icon={["fas", "plus-circle"]} />
                                                 Add Country
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    </td>
                                    <td className="first-column" align="center">
                                        <Card>
                                            <Card.Body>
                                                <button className="btn btn-secondary btn-sm">
                                                <FontAwesomeIcon
                                                    className="fas-icon"
                                                    icon={["fas", "plus-circle"]} />
                                                 Add Country
                                                </button>
                                            </Card.Body>
                                        </Card>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>{this.renderIndicator(this.props.value.page.filters, 0)}</tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
