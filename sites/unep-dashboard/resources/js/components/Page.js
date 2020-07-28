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
import Home from '../pages/Home';
import Loading from '../pages/Loading';
import axios from 'axios';
import { flatDeep } from '../data/utils.js';
import intersectionBy from 'lodash/intersectionBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';

const prefixPage = process.env.MIX_PUBLIC_URL + "/page/";

class Page extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let caches = localStorage.getItem('caches');
        if (caches === null) {
        axios.get(prefixPage + "countries")
            .then(res => {
                let countries = res.data;
                axios.get(prefixPage + "filters")
                    .then(res => {
                        let filters = res.data;
                        caches = JSON.stringify({countries: countries, filters: filters});
                        this.props.page.init(filters, countries);
                        this.props.page.loading(false);
                        localStorage.setItem('caches', caches);
                    });
            });
        } else {
            let caches = localStorage.getItem('caches');
            caches = JSON.parse(caches);
            this.props.page.init(caches.filters, caches.countries);
            console.log(this.props);
            this.props.page.loading(false);
        }
        this.props.page.change('home');
    }

    render() {
        let page = this.props.value.page.name;
        let loading = this.props.value.page.loading;
        let sidebar = this.props.value.page.sidebar;
        return (
            <Fragment>
            <Navigation/>
                <Container className="top-container">
                    <Button size="sm"
                        onClick={e => this.props.page.sidebar.toggle()}>
                        {sidebar ? "Hide Fiter" : "Show Filter"}
                    </Button>
                </Container>
                <div className={sidebar ? "d-flex" : "d-flex toggled"} id="wrapper">
                    {loading ? "" : <Sidebar/>}
                    <div id="page-content-wrapper">
                    {loading ? (<Loading/>) : ""}
                    {page === "home" ? (<Home parent={this.props}/>) : ""}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
