import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import {
    Row,
    Col,
    Jumbotron,
    Dropdown
} from 'react-bootstrap';
import Charts from '../components/Charts';
import { queueApi } from '../data/api';
import { generateData } from "../charts/chart-generator.js";

class Country extends Component {

    constructor(props) {
        super(props);
        this.renderDropdowns = this.renderDropdowns.bind(this);
        this.getDropdown = this.getDropdown.bind(this);
        this.addChildren = this.addChildren.bind(this);
        this.getCharts = this.getCharts.bind(this);
        this.state = {
            selected: [],
            charts: []
        };
    }

    getCharts(data, info) {
        let url = "data/" + info.id;
        let type = info.type === "option" ? "BAR" : "SCATTER";
            type = data.length < 3 ? "PIE" : type;
        if (data.length > 0) {
            data = type === "SCATTER"
                ? {xAxis: "Farm Size", yAxis: data.name, data: data}
                : data;
            let chart = {
                kind: type,
                title: info.details,
                config: generateData(6, true, "60vh"),
                data: data
            };
            this.setState({charts: [...this.state.charts, chart]});
        }
    }

    addChildren(data) {
        this.setState({charts: []})
        if (data.lv < 4) {
            let selected = this.state.selected;
            let current_level = data.lv - 2;
            let appends = data.lv < 3 ? data : {name: data.name, lv: data.lv, childrens:[]};
            selected[current_level] = appends;
            if (current_level === 0) {
                this.setState({selected: [appends]});
            } else {
                this.setState({selected: selected});
                let urls = data.childrens.map(x => {
                    return 'data/' + x.id
                });
                queueApi(0, urls, urls.length, this.getCharts, data.childrens);
            }
        }
    }

    renderDropdowns(x, i) {
        return (
            <Dropdown.Item
                key={'dropdown-child-' + x.lv + '-' + i}
                onClick={e => this.addChildren(x)}>
            {x.name}
            </Dropdown.Item>
        )
    }

    getDropdown(data, index) {
        let level =  data[0].lv - 2;
        let selected = this.state.selected[level];
            selected = selected ? selected.name : "Select " + data[0].sel;
        return (
            <Dropdown style={{display:"inline-block", margin:"10px"}} key={'dropdown' + index}>
              <Dropdown.Toggle variant="primary">
                  {selected}
              </Dropdown.Toggle>
                <Dropdown.Menu className={data.length > 9 ? "dropdown-scroll" : ""}>
                  { data.map((x, i) => this.renderDropdowns(x, i))}
              </Dropdown.Menu>
            </Dropdown>
        )
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState({selected:[]});
    }

    render() {
        let country = this.props.value.page.subpage.country;
        let data = this.props.value.page.filters.find(x => x.name === country);
        return (
            <Fragment>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={6} className="page-title">
                            {this.getDropdown(data.childrens, 0)}
                            {this.state.selected.map((x, i) => x.childrens.length > 0 ? this.getDropdown(x.childrens, i + 1) : "")}
                        </Col>
                        <Col md={6} className="page-title text-right">
                            <h2>Project in {country}</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content">
                    <Row>
                        {this.state.charts.map((x, i) =>
                            <Charts
                                title={x.title}
                                key={'chart-'+ i}
                                dataset={x.data}
                                kind={x.kind}
                                config={x.config}
                            />
                        )}
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Country);
