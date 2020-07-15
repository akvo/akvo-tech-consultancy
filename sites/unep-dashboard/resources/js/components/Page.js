import React, { Component, Fragment } from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import Navigation from './Navigation';
import DataFilters from './DataFilters';
import DataCountries from './DataCountries';
import DataReducers from './DataReducers';
import {
    Container,
    Button
} from 'react-bootstrap';
import Home from '../pages/Home';
import Loading from '../pages/Loading';
import axios from 'axios';
import { flatDeep } from '../data/utils.js';
import uniq from 'lodash/uniq';
import intersectionBy from 'lodash/intersectionBy';

const prefixPage = process.env.MIX_PUBLIC_URL + "/page/";

class Page extends Component {

    constructor(props) {
        super(props);
        this.getFilters = this.getFilters.bind(this);
        this.repeat = this.repeat.bind(this);
        this.changeActive = this.changeActive.bind(this);
        this.addReducer = this.addReducer.bind(this);
        this.removeReducer = this.removeReducer.bind(this);
        this.setCharts = this.setCharts.bind(this),
        this.updateCharts = this.updateCharts.bind(this),
        this.loadPrimaryDefault = this.loadPrimaryDefault.bind(this);
        this.renderReducer = this.renderReducer.bind(this);
    }

   updateCharts(data) {
        let valuesMap = data.country_values.map((x) => {
            let country = this.props.value.filters.countries.find(c => c.id === x.country_id);
            return {
                id: country.id,
                code: country.code,
                name: country.name,
                value: x.value,
            }
        });
        let child = {
            id: data.id,
            parent_id: data.parent_id,
            code: data.code,
            name: data.name,
            value: valuesMap.length !== 0 ? valuesMap.reduce((x, y) => x.value + y) : 0,
            countries: data.country_values.length,
            values: valuesMap
        };
        this.setState({disabled: false});
        this.props.chart.value.append(child);
        return true;
    }

    setCharts(id, parent_id, depth){
        let filter = depth === 1 ? 'id' : 'parent_id';
        let charts = this.props.value.charts.data;
        let chartisnew = charts.find((x => x[filter] === id))
            chartisnew = chartisnew ? false : true;
        if (parent_id === null && chartisnew) {
            this.props.chart.state.loading();
            let this_values = this.props.value.filters.list[depth].find(x => x.id === id);
            let active_filters = this.props.value.filters.reducer.ids.map(x => x.id);
                active_filters = this.props.value.filters.childs.filter(x => active_filters.includes(x.id));
            let countries = [];
            for (let i=0; i<active_filters.length; i++) {
                if (i === 0) {
                    countries = active_filters[0].country_values;
                }
                if (i !== 0) {
                    let intersect = active_filters[i].country_values;
                    countries = intersectionBy(intersect,countries, 'country_id');
                }
            }
            this_values.childs.map(x => {
                let data = x;
                if (this.props.value.filters.reducer.ids > 0){
                    data = {
                        ...x,
                        country_values: intersectionBy(data.country_values,countries, 'country_id')
                    }
                }
                console.log(data.country_values.length);
                this.updateCharts(data);
            });
            countries = this.props.value.filters.selected[depth + 1];
            this.props.chart.value.select(countries.id);
            this.props.page.loading();
        }
        if (parent_id !== null) {
            this.props.chart.state.loading();
            this.props.chart.value.select(id);
            this.props.page.loading();
        }
    }

    changeActive(id, parent_id, name, depth, kind) {
        let category;
        let countries;
        let filters = kind === "primary"
            ? this.props.value.filters
            : this.props.value.filters.reducer;
        let current = filters.list[depth];
            current = current.find((x) => x.id === id);
        if (current.hasOwnProperty('childs')){
            this.props.filter.program.append(current.childs, depth, kind);
            let next_name = current.childs[0].name;
            let next_id = current.childs[0].id;
            let next_parent_id = current.childs[0].parent_id;
            this.props.filter.program.update(next_id, next_parent_id, next_name, depth + 1, kind);
        }
        this.props.filter.program.update(id, parent_id, name, depth, kind);
        if (kind === "primary") {
            this.setCharts(id, parent_id, depth);
        }
    }

    loadPrimaryDefault() {
        setTimeout(() => {
            let selected = this.props.value.filters.list[0][0];
            this.changeActive(selected.id, selected.parent_id, selected.name, 0, "primary");
            return true;
        }, 1000);
        return;
    }

    componentDidMount() {
        let caches = localStorage.getItem('caches');
        if (caches === null) {
        axios.get(prefixPage + "countries")
            .then(res => {
                let countries = res.data;
                this.props.filter.country.init(countries);
                axios.get(prefixPage + "filters")
                    .then(res => {
                        let filters = res.data;
                        this.props.filter.program.init(filters);
                        caches = JSON.stringify({countries: countries, filters: filters});
                        localStorage.setItem('caches', caches);
                        this.loadPrimaryDefault();
                    });
            });
        } else {
            let caches = localStorage.getItem('caches');
            caches = JSON.parse(caches);
            this.props.filter.country.init(caches.countries);
            this.props.filter.program.init(caches.filters);
            this.loadPrimaryDefault();
        }
        this.props.page.change('home');
    }

    repeat(i, kind) {
        let disabled = false;
        if (i === 2) {
            disabled = true;
        }
        return (
            <DataFilters
                key={kind + '-' + i}
                depth={i}
                disabled={disabled}
                kind={kind}
                changeActive={this.changeActive}
            />
        );
    }

    getFilters(i, kind) {
        let dropdowns = [];
        let r = 0;
        while (r < i) {
            dropdowns = [...dropdowns, this.repeat(r, kind)];
            r++;
        }
        return dropdowns.map(x => {return x});
    }

    addReducer() {
        let selected = this.props.value.filters.reducer.selected;
        selected = selected[selected.length - 1];
        this.props.filter.reducer.append(selected.id, selected.parent_id);
    }

    removeReducer(id){
        this.props.filter.reducer.remove(id);
    }

    renderReducer(reducer) {
        return reducer.ids.map((x, i) => (
            <DataReducers key={i+'-reduce'} data={x} remove={this.removeReducer}/>
        ));
    }

    render() {
        let page = this.props.value.page.name;
        let loading = this.props.value.page.loading;
        let reducer = this.props.value.filters.reducer;
        let reducer_disabled = reducer.selected.length < 2 ? true : false;
        return (
            <Fragment>
            <Navigation/>
                <Container className="top-container">
                    {this.getFilters(this.props.value.filters.depth, 'primary')}
                    <Button size="sm"
                        onClick={e => this.props.filter.reducer.show()}>
                        {reducer.show ? "Hide Filter" : "Show Filter"}
                    </Button>
                    <DataCountries className='dropdown-right' data={this.props.value.filters.countries}/>
                </Container>
                    {reducer.show ? (
                        <Fragment>
                        <hr/>
                        <Container className="secondary-container">
                            {this.getFilters(this.props.value.filters.reducer.depth, 'secondary')}
                            <Button size="sm" onClick={e => this.addReducer()} disabled={reducer_disabled}>Add Filter</Button>
                        </Container>
                        <Container className="secondary-container">
                            {this.renderReducer(reducer)}
                        </Container>
                        </Fragment>
                            ) : ""
                    }
                <hr/>
                {loading ? (<Loading/>) : ""}
                {page === "home" ? (<Home parent={this.props}/>) : ""}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
