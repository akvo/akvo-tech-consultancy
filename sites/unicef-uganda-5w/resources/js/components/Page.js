import React, { Component, Fragment } from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import Navigation from './Navigation';
import {
    Container,
    Row
} from 'react-bootstrap';
import Home from '../pages/Home';
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
        const get1 = () => {return new Promise((resolve, reject) => {
            axios.get(prefixPage + "filters").then(res => {
                this.props.filter.category.init(res.data);
                let selected = this.props.value.filters.selected.filter.sub_domain;
                selected = this.props.value.filters.list.find(x => x.id === selected);
                axios.get(prefixPage + "locations/values/" + selected.parent_id + "/" + selected.id)
                    .then(res => {
                        this.props.filter.location.push(res.data)
                        resolve("filters and location values");
                    });
                });
        })};
        const get2 = () => {return new Promise((resolve, reject) => {
            axios.get(prefixPage + "locations").then(res => {
                this.props.filter.location.init(res.data);
                resolve("locations");
            });
        })};
        const get3 = () => {return new Promise((resolve, reject) => {
            axios.get(prefixPage + "locations/organisations").then(res => {
                    this.props.filter.organisation.init(res.data);
                    this.props.page.loading(false)
                    this.props.chart.state.loading(false)
                    resolve("locations organisations");
                });
        })};
        let cachetime = localStorage.getItem('cache-time');
        cachetime = cachetime !== null ? new Date(parseInt(cachetime) + (15 * 60 * 1000)) : new Date(0);
        console.log(now, cachetime);
        if (now > cachetime) {
            Promise.all([get3(), get2(), get1()]).then(res => {
                localStorage.setItem('cache', JSON.stringify(this.props.value));
                localStorage.setItem('cache-time', now.getTime());
            });
        }
        if (now < cachetime) {
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
        return <Home parent={this.props}/>
    }

    render() {
        let loading = this.props.value.page.loading;
        return (
            <Fragment>
            <Navigation/>
                {loading ? (<Loading/>) : this.activePage()}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
