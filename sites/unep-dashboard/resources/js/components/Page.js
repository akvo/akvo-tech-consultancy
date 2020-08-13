import React, { Component, Fragment } from 'react';
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

import Loading from '../pages/Loading';
import Overviews from '../pages/Overviews';
import Actions from '../pages/Actions';
import Funding from '../pages/Funding';
import Compare from '../pages/Compare';
import Reports from "../pages/Reports";
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

class Page extends Component {

    constructor(props) {
        super(props);
        this.renderPage = this.renderPage.bind(this);
        this.renderCount = this.renderCount.bind(this);
        this.renderHeaderButtons = this.renderHeaderButtons.bind(this);
        this.renderHeaderButtonsRight = this.renderHeaderButtonsRight.bind(this);
        this.downloadReport = this.downloadReport.bind(this);
        this.resetDownload = this.resetDownload.bind(this);
        this.selectAllDatapoint = this.selectAllDatapoint.bind(this);
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
                return <Compare/>
            case "report":
                return <Reports/>
            default:
                return ""
        }
    }

    downloadReport() {
        let token = document.querySelector('meta[name="csrf-token"]').content;
        let canvas = document.getElementsByTagName("canvas");
        let formData = new FormData();

        formData.set('global', this.props.value.data.global);
        this.props.value.reports.forEach(x => formData.append('datapoints[]', x));

        let image = 0;
        do {
            let image_url = canvas[image].toDataURL('image/png');
            formData.append('images[]', image_url);
            formData.append('images_name[]', 'test');
            image++;
        } while(image < canvas.length);

        axios.post(API_WEB + 'download', formData, {'Content-Type':'multipart/form-data', 'X-CSRF-TOKEN': token})
        .then(res => {
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(new Blob([res.data]));
            let newWindow = window.open('/')
            newWindow.onload = () => {
                newWindow.location = URL.createObjectURL(new Blob([res.data], {type: "text/html"}));
            };
        }).catch(err => {
            console.log("internal server error");
        });
    }

    resetDownload() {
        this.props.report.reset();
    }

    selectAllDatapoint() {
        this.props.report.appendall(this.props.value.data.filteredpoints);
    }

    renderHeaderButtons(page, sidebar) {
        let buttons = [];
        switch(page){
            case "compare":
                return "";
            default:
                buttons = ["filters","countries"];
                return buttons.map(x => (
                    <button size="sm"
                        key={x}
                        className={
                            sidebar.selected === x && sidebar.active
                            ?  "btn btn-selected btn-sm"
                            : "btn btn-primary btn-sm"
                        }
                        onClick={e => this.props.page.sidebar.toggle(x)}>
                        {x} {this.renderCount(x)}
                    </button>
                ));
        }
    }

    renderHeaderButtonsRight(page) {
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
                        label="Include in-kind Contribution"
                        />
                    </Form.Group>
                );
            case "report":
                let rcount = this.props.value.reports.length;
                let dps = this.props.value.data.filteredpoints.length;
                let disabled = (rcount > 0 && rcount <= 20) ? false : true;
                let resetdisabled = (rcount > 0) ? false : true;
                let selectdisabled = (dps > 0 && dps <= 20) ? false : true;
                return (
                    <Fragment>
                        <button
                            disabled={disabled}
                            className="btn btn-sm btn-primary btn-download"
                            onClick={e => this.downloadReport()}
                        >
                            <FontAwesomeIcon
                                className="fas-icon"
                                icon={["fas", "arrow-circle-down"]} />
                                Download
                        </button>
                        <button
                            disabled={resetdisabled}
                            className="btn btn-sm btn-primary btn-download"
                            onClick={e => this.resetDownload()}
                        >
                            <FontAwesomeIcon
                                className="fas-icon"
                                icon={["fas", "redo-alt"]} />
                                Reset
                        </button>
                        <button
                            disabled={selectdisabled}
                            className="btn btn-sm btn-primary btn-download"
                            onClick={e => this.selectAllDatapoint()}
                        >
                            <FontAwesomeIcon
                                className="fas-icon"
                                icon={["fas", "check-circle"]} />
                                Select All
                        </button>
                    </Fragment>
                )
            default:
                "";
        }
    }

    render() {
        let page = this.props.value.page.name;
        let loading = this.props.value.page.loading;
        let sidebar = this.props.value.page.sidebar;
        return (
            <Fragment>
            <Navigation/>
                <Container className="top-container">
                    {this.renderHeaderButtons(page, sidebar)}
                    {this.renderHeaderButtonsRight(page)}
                    <Filters/>
                </Container>
                <div className={sidebar.active ? "d-flex" : "d-flex toggled"} id="wrapper">
                    {loading ? "" : <Sidebar/>}
                    <div id="page-content-wrapper">
                    {loading ? (<Loading/>) : ""}
                    {this.renderPage(page)}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
