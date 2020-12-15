import React, { Component, Fragment } from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import Navigation from './Navigation';
import {
    Container,
    Row,
} from 'react-bootstrap';
import PageOverviews from '../pages/PageOverviews';
import PageActivities from '../pages/PageActivities';
import PageWebform from '../pages/PageWebform';
import axios from 'axios';
import Loading from './Loading';

const prefixPage = process.env.MIX_PUBLIC_URL + "/api/";

class Page extends Component {

    constructor(props) {
        super(props);
        this.activePage = this.activePage.bind(this);
    }

    componentDidMount() {
        this.props.page.loading(true);
        const now = new Date();
        this.props.page.loading(true);
        const getSurveys = () => {
            return new Promise((resolve, reject) => {
            axios.get(prefixPage + 'surveys').then(res => {
                this.props.filter.init(res.data);
                this.props.page.loading(false);
                resolve('finish');
            });
        })}
        let cachetime = localStorage.getItem('cache-time');
        let cache_version = document.getElementsByName('cache-version')[0].getAttribute('value');
        let current_version = localStorage.getItem('cache-version');
        cachetime = cachetime !== null ? new Date(parseInt(cachetime) + (5 * 60 * 1000)) : new Date(0);
        if (now > cachetime || cache_version !== current_version) {
            localStorage.clear();
            Promise.all([getSurveys()]).then(res => {
                localStorage.setItem('cache', JSON.stringify(this.props.value));
                localStorage.setItem('cache-time', now.getTime());
                localStorage.setItem('cache-version', cache_version);
            });
        }
        if (now < cachetime && cache_version === current_version) {
            let cached = localStorage.getItem('cache');
            cached = JSON.parse(cached);
            this.props.cache.restore(cached);
            setTimeout(() => {
                this.props.chart.state.loading(false);
            }, 2000);
        }
    }

    activePage () {
        let page = this.props.value.page.name;
        switch(page) {
            case "webform":
                return <PageWebform parent={this.props}/>
            case "activities":
                return <PageActivities parent={this.props}/>
            default:
                return <PageOverviews parent={this.props}/>
        }
    }

    render() {
        let loading = this.props.value.page.loading;
        return (
            <Fragment>
                <Navigation/>
                {loading ? (<Loading/>) : this.activePage()}
                {/* 
                    <footer className="text-center">
                        <img className="footer-img" src={`${process.env.MIX_PUBLIC_URL}/images/logo-wai.jpg`}/>
                    </footer> 
                */}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
