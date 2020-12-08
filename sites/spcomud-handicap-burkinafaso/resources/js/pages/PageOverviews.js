import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Container, Form } from "react-bootstrap";
require("../data/burkina-faso.js");
import Charts from "../components/Charts";
import {
    generateData,
} from "../data/chart-utils.js";
import { checkCache, titleCase, flattenLocations } from "../data/utils.js";
import filter from 'lodash/filter';
import Bar from '../data/options/Bar';
import Maps from '../data/options/Maps';
import Pie from '../data/options/Pie';
import DataFilters from '../components/DataFilters';
import { TextStyle } from '../data/features/animation.js';
import { retrieveColumnLayout } from "echarts/lib/layout/barGrid";
import { rangeRight } from "lodash";


const MapsOverride = (TableView) => {
    return {
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            padding:10,
            transitionDuration: 0.2,
            formatter: TableView,
            backgroundColor: "#fff",
            position: [10,150],
            ...TextStyle,
        },
        dataRange: {
            left: 15,
            top: 10,
            splitList: [
                {start: 100, label:'Above 100'},
                {start: 75, end: 100},
                {start: 50, end: 75},
                {start: 25, end: 50},
                {start: 1, end: 25},
                {end: 0, label:'No Data', icon:'circle'}
            ],
            color: ['#085fa6', '#567ba9', '#40a4dc','#bde2f2','#b6c4da'],
        }
    }
}

class PageOverviews extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getData = this.getData.bind(this);
        this.TableView = this.TableView.bind(this);
        this.getMaps = this.getMaps.bind(this);
        this.renderFirstFilterDropdown = this.renderFirstFilterDropdown.bind(this);
        this.renderFirstFilterLegend = this.renderFirstFilterLegend.bind(this);
        this.filterMapData = this.filterMapData.bind(this);
        this.state = {
            charts: [
                {
                    kind: "MAPS",
                    data: generateData(12, false, "800px")
                }
            ],
            legends: [],
            data: [],
        }
    }

    TableView(params) {
        let html = '<hr/>District: <strong>' + params.name + '</strong></br>';
        if (params.value && params.seriesType === "map") {
            // let details = params.data.details;
            html += 'Survey count: <strong>' + params.value + '</strong><br/><br/>';
        } else {
            html += "<b>No Data</b>";
        }
        return '<div class="tooltip-maps">' + html + '</div>';
    }

    getMaps() {
        let data = this.getData();
        let mapConfig = {
            data: data ,
            override: MapsOverride(this.TableView)
        };
        return mapConfig;
    }

    getData() {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        if (filters.source === null) {
            return [];
        }
        let results = filter(filters.dataLoc, (x => x.active === true));
        return results;
    }

    getOptions(list) {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page].filters;
        let title = "";
        let subtitle = "";
        return Maps(title, subtitle, this.getMaps());
    }

    getCharts(list, index) {
        return (
            <Charts
                key={index}
                kind={list.kind}
                data={list.data}
                page={this.props.value.page.name}
                options={this.getOptions(list)}
            />
        )
    }

    renderFirstFilterDropdown() {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        if (filters.source === null) {
            return "";
        }
        let config = filters.config;
        let res = config.first_filter.map(x => {
            return (
                <option key={x.question_id} value={x.question_id}>{x.text}</option>
            )
        });
        return res;
    }

    filterMapData(e) {
        let val = e.target.value;
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        // TODO : filter the data here, by legend selected, need to mapping old data again and transform it into dataLoc
    }

    renderFirstFilterLegend(e) {
        let qid = e.target.value;
        if (qid === "") {
            this.setState({ ...this.state, legends: [] });
            return;
        }
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let config = filters.config;
        let selected = filter(config.first_filter, (x => x.question_id == qid));
        let legends = selected[0].values.map((x, i) => {
            return <Form.Check 
                        onClick={e => this.filterMapsData(e)}
                        id={"legend-"+i}
                        key={x.id}
                        type="radio"
                        name="legends"
                        label={x.text}
                        value={x.text} />
        });
        this.setState({ ...this.state, legends: legends });
        return;
    }

    componentDidMount() {
        this.props.chart.state.loading(false);
    }

    render() {
        let maps = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Fragment>
            <Container className="top-container">
                <DataFilters className='dropdown-left'/>
                {/* <div className="right-listgroup"></div> */}
            </Container>
            <Container className="container-content container-sticky">
                <Row>
                    <div className="first-filter">
                        <Form>
                            <Form.Control
                                as="select"
                                onChange={e => this.renderFirstFilterLegend(e)}
                            >
                                <option value="">Select Filter</option>
                                { this.renderFirstFilterDropdown() }
                            </Form.Control>
                        </Form>
                        <div>
                            { this.state.legends }
                        </div>
                    </div>
                    {maps}
                </Row>
            </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageOverviews);
