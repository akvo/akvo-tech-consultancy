import React, { Component, Fragment } from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import Navigation from './Navigation';
import DataFilters from './DataFilters';
import DataCountries from './DataCountries';
import {
    Container
} from 'react-bootstrap';
import Home from '../pages/Home';
import axios from 'axios';

const prefixPage = process.env.MIX_PUBLIC_URL + "/page/";

class Page extends Component {

    constructor(props) {
        super(props);
        this.getFilters = this.getFilters.bind(this);
        this.repeat = this.repeat.bind(this);
    }


    componentDidMount() {
        axios.get(prefixPage + "filters")
            .then(res => {
                this.props.filter.program.init(res.data);
            });
        axios.get(prefixPage + "countries")
            .then(res => {
                this.props.filter.country.init(res.data);
            });
        this.props.page.change('home');
    }

    repeat(i) {
        return (
            <DataFilters key={i} data={this.props.value.filters} depth={i}/>
        );
    }

    getFilters(i) {
        let dropdowns = [];
        let r = 0;
        while (r < i) {
            dropdowns = [...dropdowns, this.repeat(r)];
            r++;
        }
        return dropdowns.map(x => {return x});
    }

    render() {
        let page = this.props.value.pageActive
        return (
            <Fragment>
            <Navigation/>
                <Container className="top-container">
                    {this.getFilters(this.props.value.filterDepth)}
                    <DataCountries className='dropdown-right' data={this.props.value.countries}/>
                </Container>
                {page === "home" ? (<Home parent={this.props}/>) : ""}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
