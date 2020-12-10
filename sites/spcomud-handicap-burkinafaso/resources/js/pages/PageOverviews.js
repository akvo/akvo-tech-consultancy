import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Container, Form, Accordion, Card, Button } from "react-bootstrap";
require("../data/burkina-faso.js");
import Charts from "../components/Charts";
import {
    generateData,
} from "../data/chart-utils.js";
import { checkCache, titleCase, flattenLocations, mapDataByLocations } from "../data/utils.js";
import filter from 'lodash/filter';
import Maps from '../data/options/Maps';
import DataFilters from '../components/DataFilters';
import { TextStyle } from '../data/features/animation.js';


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
        this.renderSecondFilterDropdown = this.renderSecondFilterDropdown.bind(this);
        this.renderSecondFilterOption = this.renderSecondFilterOption.bind(this);
        this.state = {
            charts: [
                {
                    kind: "MAPS",
                    data: generateData(12, false, "800px")
                }
            ],
            ff_qid: null,
            ff_legend: null,
            sf: null,
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
        return filters.filteredMapData;
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
        let answer = e.target.value;
        let { ff_qid, ff_legend } = this.state;
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let { config, locations, data, mapData } = filters;
        let locationTemp = [];
        flattenLocations(locations, locationTemp);

        if (answer === ff_legend) {
            // DO : back data to normal (remove filtered data)
            this.setState({ ...this.state, ff_legend: null });
            this.props.filter.change(
                {
                    ...filters,
                    filteredMapData: mapData,
                }, 
                page
            );
            return;
        }
        // DO : filter the data here, by legend selected, need to mapping old data again and transform it into dataLoc
        this.setState({ ...this.state, ff_legend: answer });
        let filteredData = data.map(x => {
            if (typeof x[ff_qid] === 'undefined') {
                return {
                    ...x,
                    active: false,
                };
            }
            if (x[ff_qid].answer.toLowerCase() !== answer.toLowerCase()) {
                return {
                    ...x,
                    active: false,
                };
            }
            return { ...x };
        });
        let res = mapDataByLocations(locationTemp, filteredData, config);
        this.props.filter.change(
            {
                ...filters,
                filteredMapData: res,
            }, 
            page
        );
        return;
    }

    renderFirstFilterLegend() {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let { config } = filters;
        let { ff_qid, ff_legend } = this.state;
        if (ff_qid === null || ff_qid === "") {
            return [];
        }
        let selected = filter(config.first_filter, (x => x.question_id == ff_qid));
        let legends = selected[0].values.map((x, i) => {
            return (
                <div className="mt-2" key={"ff-wrapper-"+i}>
                    <Form.Check 
                        onClick={e => this.filterMapData(e)}
                        disabled={ff_legend === null ? false : ff_legend !== x.text}
                        id={"ff-"+i}
                        key={"ff-"+x.id}
                        type="checkbox"
                        name={"ff-legends"}
                        label={x.text}
                        value={x.text} />
                </div>
            );
        });
        return legends;
    }

    renderSecondFilterOption(options) {
        let res = options.map((x, i) => {
            return (
                <div className="mt-2" key={"sf-wrapper-"+i}>
                    <Form.Check 
                        // TODO : filter data by second filter
                        // onClick={e => this.filterMapData(e)}
                        // disabled={ff_legend === null ? false : ff_legend !== x.text}
                        id={"sf-"+i}
                        key={"sf-"+x.id}
                        type="checkbox"
                        name={"sf-legends"}
                        label={x.text}
                        value={x.text} />
                </div>
            );
        });
        return res;
    }

    renderSecondFilterDropdown() {
        let { page, filters } = this.props.value;
        let { source, config } = filters[page.name];
        let { second_filter } = config;

        if (source === null) {
            return "";
        }

        let res = second_filter.map((f, i) => {
            return (
                <Card key={"sf-toggle-"+i}>
                    <Accordion.Collapse eventKey={f.question_id}>
                        <Card.Body>{ this.renderSecondFilterOption(f.values) }</Card.Body>
                    </Accordion.Collapse>
                    <Accordion.Toggle as={Card.Header} variant="link" eventKey={f.question_id}>
                        { f.text }
                    </Accordion.Toggle>
                </Card>
            );
        });
        return res;
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
                                defaultValue={this.state.ff_qid}
                                onChange={e => this.setState({ ...this.state, ff_qid: e.target.value })}
                            >
                                <option value="">Select Filter</option>
                                { this.renderFirstFilterDropdown() }
                            </Form.Control>
                        </Form>
                        <div className={ this.state.ff_qid === null ? "" : "mt-2" }>
                            { this.renderFirstFilterLegend() }
                        </div>
                    </div>

                    {maps}

                    <div className="second-filter">
                        <Accordion>
                            { this.renderSecondFilterDropdown() }
                        </Accordion>
                    </div>
                </Row>
            </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageOverviews);
