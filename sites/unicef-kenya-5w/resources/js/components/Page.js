import React, { Component, Fragment } from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import Navigation from './Navigation';
import DataFilters from './DataFilters';
import DataLocations from './DataLocations';
import {
    Container
} from 'react-bootstrap';
import Home from '../pages/Home';
import Overviews from './Overviews';
import Loading from '../pages/Loading';
import axios from 'axios';

const prefixPage = process.env.MIX_PUBLIC_URL + "/api/";

class Page extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        axios.get(prefixPage + "filters")
            .then(res => {
                this.props.filter.category.init(res.data);
                let selected = this.props.value.filters.selected.filter;
                selected = this.props.value.filters.list.find(x => x.id === selected);
                axios.get(prefixPage + "locations/values/" + selected.parent_id + "/" + selected.id)
                    .then(res => {
                        this.props.filter.location.push(res.data);
                        this.props.page.loading(false);
                    });
            });
        axios.get(prefixPage + "locations")
            .then(res => {
                this.props.filter.location.init(res.data);
            });
        this.props.page.change('achived');
    }

    render() {
        let page = this.props.value.page.name;
        let loading = this.props.value.page.loading;
        return (
            <Fragment>
            <Navigation/>
                <Container className="top-container">
                    <DataFilters className='dropdown-left' depth={1}/>
                    <DataFilters className='dropdown-left' depth={2}/>
                    <DataLocations className='dropdown-right'/>
                </Container>
                <hr/>
                {loading ? (<Loading/>) : ""}
                <Container>
                <Overviews/>
                </Container>
                {page === "planned" ? (<Home parent={this.props} valtype={'planned'}/>) : ""}
                {page === "achived" ? (<Home parent={this.props} valtype={'achived'}/>) : ""}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
