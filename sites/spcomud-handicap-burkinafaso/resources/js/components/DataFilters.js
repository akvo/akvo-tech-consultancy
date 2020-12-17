import React, { Component, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { Form, Row, Col, } from 'react-bootstrap';
import { flattenLocations, mapDataByLocations } from "../data/utils.js";
import axios from 'axios';

const prefixPage = process.env.MIX_PUBLIC_URL + "/api/";

class DataFilters extends Component {
    constructor(props) {
        super(props);
        this.changeActive = this.changeActive.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getMapSources = this.getMapSources.bind(this);
        this.state = {
            active: null,
            disabled: true,
        };
    }

    getOptions (surveys) {
        return surveys.map(survey => {
            return (
                <optgroup key={survey.id} label={survey.name}>
                    { survey.forms.map(form => 
                        <option 
                            key={form.id} 
                            value={form.id}
                        >{form.name}</option>
                    ) }
                </optgroup>  
            );
        });
    }

    getMapSources(endpoint) {
        return new Promise((resolve, reject) => {
            axios.get(prefixPage + 'maps/' + endpoint).then(res => {
                resolve(res.data);
            }).catch(error => {
                reject(error);
            });
        });
    }

    changeActive() {
        let source = event.target.value;
        let page = this.props.value.page.name;
        (page === 'overviews') 
            ? this.props.chart.state.loading(true)
            : this.props.page.loading(true);

        this.getMapSources('config/'+source).then(res => { 
            return res; 
        }).then(config => {
            this.getMapSources('location/'+source).then(res => { 
                return {
                    config: config,
                    locations: res,
                }
            }).then(conlocs => {
                this.getMapSources('data/'+source).then(res => { 
                    return {
                        ...conlocs,
                        data: res,
                    }
                }).then(results => {
                    // transform the data
                    let { data, config, locations } = results
                    let locationTemp = [];
                    flattenLocations(locations, locationTemp);
                    let mapData = mapDataByLocations(locationTemp, data, config);
                    // eol transform data
                    this.props.filter.change(
                        {
                            source: source,
                            data: results.data,
                            config: results.config,
                            locations: results.locations,
                            mapData: mapData,
                        }, 
                        this.props.value.page.name
                    );
                    return true;
                }).then(status => {
                    (page === 'overviews') 
                        ? this.props.chart.state.loading(false)
                        : this.props.page.loading(false);
                    if (status) {
                        // set default selected value for first filter
                        let { first_filter } = this.props.value.filters['overviews'].config;
                        this.props.active.update(first_filter[0].question_id, "ff_qid");
                        localStorage.setItem('cache', JSON.stringify(this.props.value));
                    }
                });   
            });
            return 'finish';
        });
    }
    
    render() {
        let base = this.props.value.base;
        return (
            <Fragment>
                <Form as={Row}>
                    <Col sm="6">
                        <Form.Group style={{marginBottom:0}} controlId="formPlaintextSource">
                            <Form.Control 
                                as="select"
                                onChange={this.changeActive}
                                defaultValue={this.props.value.filters['overviews'].source}
                            >
                                {( this.props.value.filters.overviews.source === null) 
                                    ? <option value="">Select Data Source</option> : ""}
                                { this.getOptions(base.surveys) }
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Form>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFilters);
