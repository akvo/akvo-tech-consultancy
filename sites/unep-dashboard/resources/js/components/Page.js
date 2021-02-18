import React, { Component, Fragment } from 'react';
import Tour from 'reactour';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import {
    Container,
    Button,
    Form,
    Badge
} from 'react-bootstrap';
import Filters from './Filters';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import intersectionBy from 'lodash/intersectionBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';
import { scrollWindow } from '../data/utils.js';
import Loading from '../pages/Loading';
import Overviews from '../pages/Overviews';
import Actions from '../pages/Actions';
import Funding from '../pages/Funding';
import Compare from '../pages/Compare';
import Reports from '../pages/Reports';
import Support from '../pages/Support';
import Documentation from '../pages/Documentation';
import Erd from '../pages/Erd';
import { forEach } from 'lodash';

const API_WEB = process.env.MIX_PUBLIC_URL + "/";
const API = process.env.MIX_PUBLIC_URL + "/api/";
const call = (endpoint) => {
    return new Promise((resolve, reject) => {
        axios.get(API + endpoint).then(res => {
            resolve({
                [endpoint] : res.data
            })
        });
    });
}

const toursteps = (act) => {
    const intro = {
            content: ({ close, goTo, inDOM }) => (
                <div className="col-tour text-center">
                    <strong>Welcome UNEP Data Portal</strong><br/><br/>
                    Click the following navigation below <br/>to take the tour or use <br/>keyboard cursor to navigate.<br/><br/>
                    <a href="#" onClick={close}>Skip the tour</a><br/><br/>
                </div>
            ),
            style: {borderRadius: 0}
    };
    return [
        {
            selector: '[data-tour="button-filters"]',
            content: ({ goTo, inDOM }) => {
                return (
                    <p>Filter reported actions using various attribute combination.</p>
                )
            },
            position: 'right',
            style: {borderRadius: 0, marginLeft: 10},
        },
        {
            selector: '[data-tour="tab-overview"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>Shows the overview of the reported actions</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        {
            selector: '[data-tour="tab-action"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>View additional details of the reported actions</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        {
            selector: '[data-tour="tab-funding"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>View additional details of the reported actions</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        {
            selector: '[data-tour="tab-reports"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>Download data about the reported actions</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        {
            selector: '[data-tour="tab-compare"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>Compare reported actions across countries/groups</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        {
            selector: '[data-tour="tab-support"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>Get in touch with queries / suggestions</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        {
            selector: '[data-tour="tab-documentation"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>Application Interface Documentation</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        // {
        //     selector: '[data-tour="tab-erd"]',
        //     content: ({ goTo, inDOM }) => (
        //       <div className="col-tour">
        //           <p>Entity Relationship Diagram Documentation</p>
        //       </div>
        //     ),
        //     position: 'bottom',
        //     style: {borderRadius: 0},
        // },
        {
            selector: '[data-tour="switcher-multi-country"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>Include/Exclude  actions being implemented across multiple countries</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
        {
            selector: '[data-tour="switcher-keep-filter"]',
            content: ({ goTo, inDOM }) => (
              <div className="col-tour">
                  <p>Ensures that current filter is applicable to all the tabs</p>
              </div>
            ),
            position: 'bottom',
            style: {borderRadius: 0},
        },
    ]
}



class Page extends Component {

    constructor(props) {
        super(props);
        this.renderPage = this.renderPage.bind(this);
        this.renderCount = this.renderCount.bind(this);
        this.renderHeaderButtons = this.renderHeaderButtons.bind(this);
        this.renderHeaderButtonsRight = this.renderHeaderButtonsRight.bind(this);
        this.downloadReport = this.downloadReport.bind(this);
        this.openReport = this.openReport.bind(this);
        this.resetDownload = this.resetDownload.bind(this);
        this.selectAllDatapoint = this.selectAllDatapoint.bind(this);
        this.closeTour = this.closeTour.bind(this);
        this.state = {
            isTourOpen: true,
            isDownloadReady: false,
            reportBlob: ""
        };
    }

    componentDidMount() {
        const now = new Date();
        let caches = localStorage.getItem('caches');
        let cachetime = localStorage.getItem('cache-time');
        let cache_version = document.getElementsByName('cache-version')[0].getAttribute('value');
        let current_version = localStorage.getItem('cache-version');
        cachetime = cachetime !== null ? new Date(parseInt(cachetime) + (60 * 60 * 1000)) : new Date(0);
        if (now > cachetime || cache_version !== current_version) {
            localStorage.clear();
            const calls = [
                call("countries"),
                call("filters"),
                call("data")
            ];
            Promise.all(calls)
                .then(res => {
                    const response = {
                        ...res[0],
                        ...res[1],
                        data: res[2].data.data,
                        datapoints: res[2].data.datapoints
                    }
                    caches = JSON.stringify(response);
                    this.props.page.init(response);
                    localStorage.setItem('caches', caches);
                    localStorage.setItem('cache-time', now.getTime());
                    localStorage.setItem('cache-version', cache_version);
                    this.props.page.loading(false);
                })
        }
        if (now < cachetime && cache_version === current_version) {
            caches = JSON.parse(caches);
            this.props.page.init(caches);
            this.props.page.loading(false);
        }
        this.props.page.change('overviews');
    }

    renderCount(kind) {
        let total = this.props.value.data[kind].length;
        if (total > 0) {
            return (
                <div className="badge badge-filters badge-sm">
                    {total}
                </div>
            )
        }
        return "";
    }

    renderPage(page) {
        switch(page){
            case "overviews":
                return <Overviews/>
            case "actions":
                return <Actions/>
            case "funding":
                return <Funding/>
            case "compare":
                if (this.props.value.page.sidebar.active) {
                    this.props.page.sidebar.toggle();
                }
                return <Compare/>
            case "report":
                return <Reports/>
            case "support":
                if (this.props.value.page.sidebar.active) {
                    this.props.page.sidebar.toggle();
                }
                return <Support/>
            case "documentation":
                if (this.props.value.page.sidebar.active) {
                    this.props.page.sidebar.toggle();
                }
                return <Documentation/>
            case "erd":
                if (this.props.value.page.sidebar.active) {
                    this.props.page.sidebar.toggle();
                }
                return <Erd/>
            default:
                return ""
        }
    }

    openReport() {
        let newWindow = window.open("/download");
        newWindow.onload = () => {
            newWindow.location = URL.createObjectURL(this.state.reportBlob);
        };
        this.setState({isDownloadReady : false});
    }

    downloadReport() {
        this.props.report.download(true);
        let blocks = ["TREEMAP", "PIE", "PIE", "BAR", "BAR", "SANKEY", "BAR", "BARBUTPIE"]
            blocks = blocks.map(x => {
                if (x === "PIE") {
                    return 2;
                }
                return 1;
            })
        let token = document.querySelector('meta[name="csrf-token"]').content;
        let canvas = document.getElementsByTagName("canvas");
        let formData = new FormData();

        formData.set('global', this.props.value.data.global);
        this.props.value.reports.list.forEach(x => formData.append('datapoints[]', x));

        let image = 0;
        do {
            let image_url = canvas[image].toDataURL('image/png');
            formData.append('images[]', image_url);
            formData.append('blocks[]', blocks[image]); // 1 or 2
            image++;
        } while(image < canvas.length);

        setTimeout(() => {
            axios.post(API_WEB + 'download', formData, {'Content-Type':'multipart/form-data', 'X-CSRF-TOKEN': token})
                .then(res => {
                    this.props.report.download(false);
                    this.setState({reportBlob:new Blob([res.data], {type: "text/html"}), isDownloadReady:true});
                    //this.openReport();
                }).catch(err => {
                    this.props.report.download(false);
                    console.log("internal server error");
                });

        }, 10000)
    }

    resetDownload() {
        this.props.report.reset();
    }

    selectAllDatapoint() {
        this.props.report.appendall(this.props.value.data.filteredpoints);
    }

    renderHeaderButtons(page, sidebar, lang) {
        let buttons = [];
        switch(page){
            case "compare":
                return "";
            case "documentation":
                return "";
            case "support":
                return "";
            default:
                buttons = ["filters","countries"];
                return buttons.map((x) => (
                    <button size="sm"
                        key={x}
                        data-tour={"button-" + x}
                        className={
                            sidebar.selected === x && sidebar.active
                            ?  "btn btn-selected btn-sm"
                            : "btn btn-primary btn-sm " + x
                        }
                        onClick={e => this.props.page.sidebar.toggle(x)}>
                        {lang[x]} {this.renderCount(x)}
                    </button>
                ));
        }
    }

    renderHeaderButtonsRight(page, lang) {
        switch(page){
            case "funding":
                return (
                    <Form.Group
                        className="fund-switcher"
                        onChange={this.props.page.toggle.fundcontrib}
                        controlId="formFinance">
                    <Form.Check
                        type="switch"
                        defaultChecked={this.props.value.page.fundcontrib}
                        label={lang.includeinKind}
                        />
                    </Form.Group>
                );
            case "report":
                let rcount = this.props.value.reports.list.length;
                let dps = this.props.value.data.filteredpoints.length;
                let disabled = (rcount > 0 && rcount <= 20) ? this.props.value.reports.download : true;
                let downloadIcon = this.props.value.reports.download
                    ? "spinner"
                    : (this.state.isDownloadReady ? "check-circle" : "arrow-circle-down");
                let resetdisabled = (rcount > 0) ? false : true;
                let selectdisabled = (dps > 0 && dps <= 20) ? false : true;
                let downloadAction = this.state.isDownloadReady ? this.openReport : this.downloadReport;
                let downloadCss = this.state.isDownloadReady ? "btn-success" : "btn-primary";
                    downloadCss = "btn btn-sm " + downloadCss + " btn-download";
                return (
                    <Fragment>
                        <button
                            disabled={disabled}
                            className={downloadCss}
                            onClick={e => downloadAction()}
                        >
                            <FontAwesomeIcon
                                className="fas-icon"
                                spin={this.props.value.reports.download}
                                icon={["fas", downloadIcon]} />
                                {this.props.value.reports.download
                                    ? lang.generating
                                    : (this.state.isDownloadReady ? lang.clickToDownload : lang.generate)}
                        </button>
                        <button
                            disabled={resetdisabled}
                            className="btn btn-sm btn-primary btn-download"
                            onClick={e => this.resetDownload()}
                        >
                            <FontAwesomeIcon
                                className="fas-icon"
                                icon={["fas", "redo-alt"]} />
                                {lang.reset}
                        </button>
                        <button
                            disabled={selectdisabled}
                            className="btn btn-sm btn-primary btn-download"
                            onClick={e => this.selectAllDatapoint()}
                        >
                            <FontAwesomeIcon
                                className="fas-icon"
                                icon={["fas", "check-circle"]} />
                                {lang.selectAll}
                        </button>
                    </Fragment>
                )
            case "compare":
                return "";
            case "support":
                return "";
            case "documentation":
                return "";
            default:
                let fp = this.props.value.data.filteredpoints;
                let ct = this.props.value.data.countries;
                let mt = this.props.value.data.master;
                if (ct.length > 0) {
                    mt = mt.filter(x => {
                        return ct.includes(x.country_id);
                    });
                }
                if (mt.length !== 0) {
                    ct = mt.filter(x => {
                        let dp = x.values.map(v => v.datapoints);
                        dp = flatten(dp);
                        dp = intersection(dp, fp);
                        return dp.length > 0;
                    });
                } else {
                    ct = [];
                }
                let w_actions = fp.length === 1 ? lang.action : lang.actions;
                let w_countries = ct.length === 1 ? lang.countries : lang.countries;
                return (
                    <Fragment>
                        <div className="overview-summary overview-last">
                            <span>{ct.length} {w_countries}</span>
                        </div>
                        <div className="overview-summary">
                            {lang.reportedBy}
                        </div>
                        <div className="overview-summary">
                            <span>{fp.length} {w_actions}</span>
                        </div>
                    </Fragment>
                )
        }
    }

    closeTour () {
        this.props.page.tour();
    }

    renderCloseTour() {
        return <div className="btn btn-primary btn-sm btn-pills">Close</div>
    }

    render() {
        let page = this.props.value.page.name;
        let loading = this.props.value.page.loading;
        let sidebar = this.props.value.page.sidebar;
        let lang = this.props.value.locale.lang;
        let hideContainer = (page === "support"
            || page === "compare"
            || page === "documentation"
            || page === "erd"
        ) ? " hidden" : "";
        let wrapperId = hideContainer === "" ? "wrapper" : "wrapper-up";
        return (
            <Fragment>
                <Navigation/>
                <Container className={"top-container" + hideContainer}>
                    {this.renderHeaderButtons(page, sidebar, lang)}
                    {page === "overviews" ? (
                    <button
                        onClick={e => this.props.page.tour()}
                        className="tour-info btn btn-secondary btn-sm">
                        <FontAwesomeIcon
                            icon={["fas", "info-circle"]} /> {lang.pageTour}
                    </button>)
                    : ""}
                    {this.renderHeaderButtonsRight(page, lang)}
                    <Filters/>
                </Container>
                <div className={sidebar.active ? "d-flex" : "d-flex toggled"} id={wrapperId}>
                    {loading ? "" : <Sidebar/>}
                    <div id="page-content-wrapper">
                    {loading ? (<Loading/>) : ""}
                    {this.renderPage(page)}
                    </div>
                </div>
                <div onClick={e => scrollWindow(1)} className="section-scroll" >
                    <span></span>
                </div>
                    {loading ? "" :
                        <Tour
                            startAt={0}
                            onAfterOpen={e => this.props.page.sidebar.toggle("filters")}
                            onBeforeClose={e => this.props.page.sidebar.hide()}
                            maskSpace={0}
                            showNumber={false}
                            steps={toursteps(this.props.page)}
                            isOpen={this.props.value.page.tour}
                            onRequestClose={e => this.closeTour()}
                            lastStepNextButton={this.renderCloseTour()}
                        />
                    }
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
