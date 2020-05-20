import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Row, Container, Jumbotron } from "react-bootstrap";
require("../data/kenya.js");
import Charts from "../components/Charts";
import {
    generateData,
    loadingChart
} from "../data/chart-utils.js";
import Bar from '../data/options/Bar';
import Maps from '../data/options/Maps';
import Pie from '../data/options/Pie';
import TreeMap from '../data/options/TreeMap';

const MapsFormatter = (params) => {
    if (params.value) {
        let orgs = params.data.details.map((x) => x.name);
        let html = params.seriesName + '<br/>' + params.name + ': ' + params.value + '<hr/>';
        html += orgs.join();
        return html;
    }
    return params.seriesName + '<br/>' + params.name + ': No Data';
}
const MapsOverride = {
    dataRange: {
    x: 40,
    y: 40,
    splitList: [
        {start: 10},
        {start: 8, end: 9},
        {start: 6, end: 7},
        {start: 3, end: 5},
        {start: 1, end: 2},
        {end: 0},
    ],
    color: ['#085fa6', '#567ba9', '#40a4dc','#bde2f2','#b6c4da'],
    },
    markArea: {
        label: {
            show:true,
            distance:5
        }
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.state = {
            charts: [
                {
                    kind: "MAPS",
                    page: "HOME",
                    data: generateData(12, true, "800px")
                },
            ]
        }
        this.getMaps = this.getMaps.bind(this);
    }

    getMaps(data) {
        data = data.map((x) => {
            return {
                name: x.name,
                value: x.organisations.count,
                values: x.organisations,
                details: x.organisations.list,
            }
        });
        let max = 1;
        let min = 0;
        let values = data.map(x => x.value);
        if (data.length > 1){
            min = values.sort((x, y) => x - y)[0];
            max = values.sort((x, y) => y - x)[0];
        }
        return {
            min:min,
            max:max,
            data:data,
            formatter: MapsFormatter,
            override: MapsOverride
        }
    }

    getOptions(list) {
        let data = this.props.value.filters.organisation_values;
        let title = "Reporting Organisations";
        switch (list.kind) {
            case "MAPS":
                return Maps(title, "Total Organisations", this.getMaps(data));
            default:
                return Bar(selected.name, location.name, this.getBar(valtype, location_values));
        }
    }

    getCharts(list, index) {
        return (
            <Charts
                key={index}
                kind={list.kind}
                data={list.data}
                page={list.page}
                options={this.getOptions(list)}
            />
        )
    }

    render() {
        let chart = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        return (
            <Fragment>
            <Container className="top-container">
            </Container>
            <hr/>
			<Container>
				<Row>{chart}</Row>
			</Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
