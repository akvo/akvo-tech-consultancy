import React, { Component, Fragment } from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import {
    Container,
    Button
} from 'react-bootstrap';
import Overviews from '../pages/Overviews';
import Loading from '../pages/Loading';
import Filters from './Filters';
import axios from 'axios';
import intersectionBy from 'lodash/intersectionBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    }

    componentDidMount() {
        this.props.page.change('overviews');
        let caches = localStorage.getItem('caches');
        if (caches === null) {
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
                    this.props.page.loading(false);
                })
        } else {
            let caches = localStorage.getItem('caches');
            caches = JSON.parse(caches);
            this.props.page.init(caches);
            this.props.page.loading(false);
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
                    <Button size="sm">
                        <FontAwesomeIcon icon={["fas", "filter"]}/>
                    </Button>
                    <button size="sm"
                        className={
                            sidebar.selected === "filters" && sidebar.active
                            ?  "btn btn-selected btn-sm"
                            : "btn btn-primary btn-sm"
                        }
                        onClick={e => this.props.page.sidebar.toggle("filters")}>
                        Actions
                    </button>
                    <button size="sm"
                        className={
                            sidebar.selected === "countries" && sidebar.active
                            ?  "btn btn-selected btn-sm"
                            : "btn btn-primary btn-sm"
                        }
                        onClick={e => this.props.page.sidebar.toggle("countries")}>
                        Countries
                    </button>
                    <Filters/>
                </Container>
                <div className={sidebar.active ? "d-flex" : "d-flex toggled"} id="wrapper">
                    {loading ? "" : <Sidebar/>}
                    <div id="page-content-wrapper">
                    {loading ? (<Loading/>) : ""}
                    {page === "overviews" ? (<Overviews parent={this.props}/>) : ""}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
