import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Container, Form, Accordion, Card, Button } from "react-bootstrap";
require("../data/burkina-faso.js");
import Charts from "../components/Charts";
import {
    generateData,
} from "../data/chart-utils.js";
import { 
    flattenLocations, 
    mapDataByLocations, 
    filterMapData,
} from "../data/utils.js";
import filter from 'lodash/filter';
import find from 'lodash/find';
import Maps from '../data/options/Maps';
import DataFilters from '../components/DataFilters';
import { TextStyle } from '../data/features/animation.js';
import ModalDetail from '../components/ModalDetail';
import Draggable from 'react-draggable';
import Pie from "../data/options/Pie";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

const MapsOverride = (TableView) => {
    return {
        // tooltip: {
        //     trigger: 'item',
        //     showDelay: 0,
        //     padding:10,
        //     transitionDuration: 0.2,
        //     formatter: TableView,
        //     backgroundColor: "#fff",
        //     position: [10,150],
        //     ...TextStyle,
        // },
        dataRange: {
            left: 15,
            top: 10,
            splitList: [
                {start: 100, label:'Above 100'},
                {start: 75, end: 100},
                {start: 50, end: 75},
                {start: 25, end: 50},
                {start: 1, end: 25},
                {end: 1, label:'No Data', icon:'circle'}
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
        this.filterMap = this.filterMap.bind(this);
        this.renderSecondFilterDropdown = this.renderSecondFilterDropdown.bind(this);
        this.renderSecondFilterOption = this.renderSecondFilterOption.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onLoadFilter = this.onLoadFilter.bind(this);
        this.getPie = this.getPie.bind(this);
        this.state = {
            charts: [
                {
                    kind: "MAPS",
                    data: generateData(12, false, "800px")
                }
            ],
            pie_chart: [
                {
                    kind: "PIE",
                    data: generateData(12, false, "500px")
                }
            ],
            ff_qid: null,
            ff_legend: [],
            sf_qid: null,
            sf_legend: [],
            sf_checked: [],
            sf_all_legends: [],
        }
    }

    TableView(params) {
        let html = '<hr/>District: <strong>' + params.name + '</strong></br>';
        if (params.value && params.seriesType === "map") {
            html += 'Data: <strong>' + params.value + '</strong><br/><br/>';
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
        let { config, locations, data, mapData } = filters;
        let locationTemp = [];
        flattenLocations(locations, locationTemp);
        let res = mapDataByLocations(locationTemp, data, config);
        return res;
    }

    getPie() {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let { active } = this.props.value.base;
        if (filters.source === null) {
            return [];
        }

        let activeFilter = filters.config.first_filter.find(x => x.question_id === active.ff_qid);
        // DO :: Maps data with active filter
        let pieData = activeFilter.values.map(val => {
            let dataByFirstFilter = filter(filters.data, (x) => {
                if (typeof x[active.ff_qid] === 'undefined') {
                    return null;
                }
                return x[active.ff_qid].answer.toLowerCase().includes(val.text.toLowerCase());
            });
            let filteredDataByFirstFilter = filter(dataByFirstFilter, (z => z.active === true));
            return {
                value: filteredDataByFirstFilter.length,
                name: val.text,
            };
        });
        return pieData;
    }

    getOptions(list) {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let { active } = this.props.value.base;
        switch (list.kind) {
            case "MAPS":
                return Maps("", "", this.getMaps());        
            default:
                // rose pie
                let title = "";
                if (filters.source !== null) {
                    let activeFilter = filters.config.first_filter.find(x => x.question_id === active.ff_qid);
                    title = activeFilter.text;
                }
                return Pie(this.getPie(), title, "", null, null, true);
        }
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

    filterMap(answer, type, arrayDefaultValue) {
        let { ff_qid, sf_qid } = this.props.value.base.active;
        let { ff_legend, sf_legend, sf_checked } = this.state;
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let { config, locations, data, mapData } = filters;
        let filteredData = [];

        // set qid and legend by filter type
        let qid = (type === 'ff') ? ff_qid : sf_qid;
        let legendSelected = (type === 'ff') ? ff_legend : sf_legend;
        let stateKey = (type === 'ff') ? 'ff_legend' : 'sf_legend';
        let filterStatus = (type === 'ff') ? false : true;

        // remove checked value for sf
        let filter_checked = sf_checked;
        if (type === 'sf' && sf_checked.includes(answer)) {
            filter_checked = filter(sf_checked, (x => x !== answer));
        }

        // return checked value for sf
        if (type === 'sf' && !sf_checked.includes(answer)) {
            filter_checked = (answer !== null) ? (
                                (answer !== 'select-all') 
                                    ? [...sf_checked, answer] 
                                    : arrayDefaultValue 
                            ) : [];
        }

        if (legendSelected.includes(answer)) {
            // DO : back data to normal (remove filtered data)
            let reset_legend = (type === 'ff') ? filter(this.state[stateKey], (x => x !== answer)) : filter_checked;
            this.setState(
                { ...this.state, [stateKey]: reset_legend, sf_checked: filter_checked },
                () => {
                    filteredData = filterMapData(filterStatus, data, qid, this.state[stateKey]);
                    this.props.active.update(reset_legend, stateKey);
                    this.props.active.update(filter_checked, 'sf_checked');
                    this.props.filter.change(
                        {
                            ...filters,
                            data: filteredData,
                        }, 
                        page
                    );
                });
        }

        if (!legendSelected.includes(answer)) {
            // DO : filter the data here, by legend selected, need to mapping old data again and transform it into dataLoc
            let selected_legend = (type === 'ff') ? [...this.state[stateKey], answer] : filter_checked;
            this.setState(
                { ...this.state, [stateKey]: selected_legend, sf_checked: filter_checked }, 
                () => {
                    filteredData = filterMapData(true, data, qid, this.state[stateKey]);
                    this.props.active.update(selected_legend, stateKey);
                    this.props.active.update(filter_checked, 'sf_checked');
                    this.props.filter.change(
                        {
                            ...filters,
                            data: filteredData,
                        }, 
                        page
                    );
                });
        }

        return;
    }

    renderFirstFilterLegend() {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let { config } = filters;
        // let { ff_legend } = this.state;
        let { ff_qid, ff_legend } = this.props.value.base.active;
        if (ff_qid === null || ff_qid === "") {
            return [];
        }
        let selected = filter(config.first_filter, (x => x.question_id == ff_qid));
        let legends = selected[0].values.map((x, i) => {
            return (
                <div className="mt-2" key={"ff-wrapper-"+i}>
                    <Form.Check 
                        onChange={e => this.filterMap(e.target.value, 'ff')}
                        disabled={ff_legend.length === 0 ? false : !ff_legend.includes(x.text)}
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
        let sf_checked = this.props.value.base.active.sf_checked;
        let res = options.map((x, i) => {
            return (
                <div className="mt-2" key={"sf-wrapper-"+i}>
                    <Form.Check 
                        // checked={this.state.sf_checked.includes(x.text)}
                        checked={sf_checked.includes(x.text)}
                        onChange={e => this.filterMap(e.target.value, 'sf')}
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
                        <Card.Body>
                            { this.renderSecondFilterOption(f.values) }
                            <hr/>
                            <div id="button-checked-wrapper" className="mt-2">
                                <Button 
                                    block
                                    variant="danger" 
                                    onClick={() => this.filterMap(null, 'sf')}>
                                        Deselect All
                                </Button>
                                <Button 
                                    block
                                    variant="primary" 
                                    // onClick={() => this.filterMap('select-all', 'sf', this.state.sf_all_legends)}>
                                    onClick={() => this.filterMap('select-all', 'sf', this.props.value.base.active.sf_all_legends)}>
                                        Select All
                                </Button>
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                    <Accordion.Toggle 
                        as={Card.Header} 
                        onClick={() => this.onChangeFilter(f.question_id, "sf", f.values)} 
                        variant="link" 
                        eventKey={f.question_id}
                        style={{cursor:"pointer"}}
                    >
                        { f.text }
                    </Accordion.Toggle>
                </Card>
            );
        });
        return res;
    }

    onChangeFilter(qid, type, values=[]) {
        let key = type + '_qid';
        this.setState({ ...this.state, [key]: qid });
        this.props.active.update(qid, key);
        // set default sf_legend
        if (type === 'sf') {
            let page = this.props.value.page.name;
            let filters = this.props.value.filters[page];
            let sf = filters.config.second_filter;
            let sf_active = find(sf, (x => x.question_id === qid));
            let sf_active_values = sf_active.values.map(x => x.text);
            // set default checked
            let checked_all = values.map(x => x.text);
            this.props.active.update(checked_all, 'sf_checked');
            this.props.active.update(checked_all, 'sf_all_legends');
            this.setState({ 
                ...this.state, 
                sf_legend: sf_active_values, 
                sf_checked: checked_all, 
                sf_all_legends: checked_all 
            });
        }
        return;
    }

    onLoadFilter() {
        // set default selected value for first filter
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        if (filters.source !== null) {
            let ff = filters.config.first_filter;
            this.onChangeFilter(ff[0].question_id, "ff");
        }
        return;
    }

    componentDidMount() {
        this.props.chart.state.loading(false);
        this.onLoadFilter();
        this.setState({ ...this.state, "ff_qid": this.props.value.base.active.ff_qid });
    }

    render() {
        let page = this.props.value.page.name;
        let filters = this.props.value.filters[page];
        let maps = this.state.charts.map((list, index) => {
            return this.getCharts(list, index);
        });
        let pie = "";
        if (filters.source !== null) { 
            pie = this.state.pie_chart.map((list, index) => {
                return this.getCharts(list, index);
            });
        }

        return (
            <Fragment>
            <Container className="top-container">
                <DataFilters className='dropdown-left'/>
                {/* <div className="right-listgroup"></div> */}
            </Container>
            <Container className="container-content container-sticky">
                <Row>
                    {/* First Filter */}
                    { filters.source !== null ?
                        <div className="first-filter">
                            <Form>
                                <Form.Control
                                    as="select"
                                    onChange={e => this.onChangeFilter(e.target.value, "ff")}
                                >
                                    {/* <option value="">Select Filter</option> */}
                                    { this.renderFirstFilterDropdown() }
                                </Form.Control>
                            </Form>
                            <div className={ this.state.ff_qid === null ? "" : "mt-2" }>
                                { this.renderFirstFilterLegend() }
                            </div>
                        </div>
                    : "" }

                    {maps}

                    {/* Second Filter */}
                    { filters.source !== null ? 
                        <div className="second-filter">
                            <Accordion>
                                { this.renderSecondFilterDropdown() }
                            </Accordion>
                        </div>
                    : "" }

                    {/* Pie Chart */}
                    { filters.source !== null ? 
                        <Draggable>
                            <div className="pie-filter">
                                { pie }
                            </div>
                        </Draggable>
                    : "" }
                </Row>
            </Container>

            <ModalDetail />
            
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageOverviews);
