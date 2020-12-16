import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import { Modal } from 'react-bootstrap';
import { filter, find } from 'lodash';
import Charts from '../components/Charts';
import StackBar from "../data/options/StackBar";
import {
    generateData,
} from "../data/chart-utils.js";

class OphBf extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getStackBar = this.getStackBar.bind(this);
        this.state = {
            charts: [
                {
                    title: "",
                    kind: "STACK",
                    data: generateData(12, false, "700px"),
                },
            ]
        }
    }

    getOptions(list) {
        let page = this.props.value.page.name;
        switch (list.kind){
            case "STACK":
                let title = "";
                return StackBar(title, "", this.getStackBar());
            default:
                return [];
                // return Bar(list.title, list.get, this.getBars(list));
        }
    }

    getCharts(list, index) {
        return (
            <Charts
                key={index}
                kind={list.kind}
                data={list.data}
                page={this.props.value.page.name}
                options={this.getOptions(list)}
            />
        )
    }

    getStackBar() {
        let page = this.props.value.page.name;
        let { source, locations, config, data } = this.props.value.filters[page];
        let { match_question } = config.maps;
        let { active, modal } = this.props.value.base;
        let { name, value, details } = modal.selectedModalDetail;

        // DO :: filter the data base on first filter active & create stack bar chart for that
        let activeFilterValues = find(config.first_filter, (x) => x.question_id === active.ff_qid);

        // :: MAP data by location then ff filter
        // let filteredData = locations.map(loc => {
        //     let dataByLocation = filter(data, (x) => {
        //         return x[match_question].answer.toLowerCase().includes(loc.name.toLowerCase());
        //     });
        //     let filteredDataByLocation = filter(dataByLocation, (z => z.active === true));

        //     let mapFirstFilter = activeFilterValues.values.map(val => {
        //         let filteredDataByFirstFilter = filter(filteredDataByLocation, (y) => {
        //             if (typeof y[active.ff_qid] === 'undefined') {
        //                 return null;
        //             }
        //             return y[active.ff_qid].answer.toLowerCase().includes(val.text.toLowerCase());
        //         });
        //         return filteredDataByFirstFilter.length;
        //     });

        //     return {
        //         name: loc.name,
        //         type: 'bar',
        //         stack: 'location',
        //         label: {
        //             show: true,
        //             position: 'inside',
        //         },
        //         data: mapFirstFilter,
        //     };
        // });
        // let categories = activeFilterValues.values.map(x => x.text);
        // let legends = locations.map(x => x.name);

        // :: MAP data by ff filter then location
        let filteredData = activeFilterValues.values.map(val => {
            let dataByFirstFilter = filter(data, (y) => {
                if (typeof y[active.ff_qid] === 'undefined') {
                    return null;
                }
                return y[active.ff_qid].answer.toLowerCase().includes(val.text.toLowerCase());
            });
            let filteredDataByFirstFilter = filter(dataByFirstFilter, (z => z.active === true));

            let mapDataByLocation = locations.map(loc => {
                let dataByLocation = filter(filteredDataByFirstFilter, (x) => {
                    return x[match_question].answer.toLowerCase().includes(loc.name.toLowerCase());
                });
                return dataByLocation.length;
            });

            // add location click on map to series
            let detailsData = filter(details, (y) => {
                if (typeof y[active.ff_qid] === 'undefined') {
                    return null;
                }
                return y[active.ff_qid].answer.toLowerCase().includes(val.text.toLowerCase());
            });
            let filteredDetailsData = filter(detailsData, (z => z.active === true));
            // eol

            return {
                name: val.text,
                type: 'bar',
                stack: activeFilterValues.text,
                label: {
                    show: true,
                    position: 'inside'
                },
                data: [filteredDetailsData.length, ...mapDataByLocation],
            };
        });
        let categories = locations.map(x => x.name);
        let legends = activeFilterValues.values.map(x => x.text);
        
        return {
            legends: legends,
            categories: [name, ...categories],
            series: filteredData,
        };
    }

    render() {
        let { modal } = this.props.value.base;
        let { name, value, active } = modal.selectedModalDetail;
        let chart = this.state.charts.map((list, index) => {
            return this.getCharts(list, index);
        });

        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        { name }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { chart }
                </Modal.Body>
            </>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OphBf);