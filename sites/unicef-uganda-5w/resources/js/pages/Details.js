import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    Col,
    Row,
    Container,
    Jumbotron,
    ListGroup,
    Card
} from "react-bootstrap";
import Charts from "../components/Charts";
import DataFilters from '../components/DataFilters';
import DataTypes from '../components/DataTypes';
import DataLocations from '../components/DataLocations';
import {
    generateData,
    loadingChart
} from "../data/chart-utils.js";
import Bar from '../data/options/Bar';
import Maps from '../data/options/Maps';
import Pie from '../data/options/Pie';
import TreeMap from '../data/options/TreeMap';

require("../data/kenya.js");

const mapData = (name, path) => {
    return {
        value: 1,
        name: name.toProperCase(),
        path: path + '/' + name.toProperCase()
    }
}

const MapsFormatter = (params) => {
    if (params.value) {
        var value = (params.value + '').split('.');
        value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
        let list = [];
        for (let k in params.data.values) {
            if (k.includes("_achived")){
                list = [
                    ...list,
                    k.replace("_achived", "").toUpperCase() + ": " + params.data.values[k]
                ];
            };
        }
        let details = [];
        for (let k in params.data.details) {
            details = [
                ...details,
                k.toUpperCase() + ": " + params.data.details[k].list
            ];
        }
        return params.seriesName + '<br/>' + params.name + ': ' + value + '<hr/>' + list.join('<br/>') + '<hr/>' + details.join('<br/>') ;
    }
    return params.seriesName + '<br/>' + params.name + ': No Data';
}

class Details extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.countDetail = this.countDetail.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.state = {
            charts: [
                {
                    kind: "TREEMAP",
                    page: "DETAILS",
                    data: generateData(6, false, "500px")
                },
                {
                    kind: "MAPS",
                    page: "DETAILS",
                    data: generateData(6, true, "500px")
                },
                {
                    kind: "BAR",
                    page: "DETAILS",
                    data: generateData(12, true, "320px")
                }
            ]
        }
        this.getBar = this.getBar.bind(this);
        this.getMaps = this.getMaps.bind(this);
        this.getPie = this.getPie.bind(this);
        this.getTree = this.getTree.bind(this);
    }

    getBar(valtype, locations) {
        let labels = [];
        let values = [];
        valtype = "value_" + valtype;
        let i = 0;
        do {
            if (locations[i].values!== undefined) {
                labels = [...labels, locations[i].text];
                values = [...values, locations[i].values[valtype]];
            }
            i++;
        } while (i < locations.length);
        return {
            labels: labels,
            values: values
        }
    }

    getPie() {
        return;
    }

    getTree(data) {
        return [
            {
                name: "Reporting Donors",
                path: "Reporting Donors",
                value: data.donors.count,
                children: data.donors.list.map(x => {
                    return mapData(x, "Reporting Donors")
                })
            },
            {
                name: "Reporting Organisations",
                path: "Reporting Organisations",
                value: data.organisations.count,
                children: data.organisations.list.map(x => {
                    return mapData(x, "Reporting Organisations")
                })
            },
            {
                name: "Implementing Partners",
                path: "Implementing Partners",
                value: data.implementing.length,
                children: data.implementing.list.map(x => {
                    return mapData(x, "Implementing Partners")
                })
            },
            {
                name: "Counties",
                path: "Counties",
                value: data.locations.count,
                children: data.locations.list.map(x => {
                    return mapData(x, "Counties")
                })
            }
        ];
    }

    getMaps(locations, valtype) {
        console.log(locations);
        valtype = "value_" + valtype;
        let data = locations.map((x) => {
            return {
                name: x.text,
                code: x.code,
                value: x.values[valtype] === 0 ? 1 : x.values[valtype],
                values: x.values,
                details: x.details
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
            override: false
        }
    }

    getOptions(list) {
        let valtype = this.props.value.filters.selected.type;
        let selected = this.props.value.filters.selected.filter;
        selected = this.props.value.filters.list.find(x => x.id === selected);
        let location = this.props.value.filters.locations;
        let location_values = this.props.value.filters.location_values;
        let selected_location = this.props.value.filters.selected.location;
        location = location.find(x => x.id === selected_location);
        location = location.code === "KENYA"
            ? location
            : location_values.find(x => x.id === location.id);
        switch (list.kind) {
            case "MAPS":
                return Maps(selected.name, location.name, this.getMaps(location_values, valtype));
            case "PIE":
                return Pie(selected.name, location.name, this.getPie());
            case "TREEMAP":
                return TreeMap(selected.name, location.name, this.getTree(selected));
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

    countDetail(data, name) {
        return (
            <Col>
              <Card style={{ marginBottom: '1rem'}}>
                <Card.Header style={{textAlign:'center'}}>{name}</Card.Header>
                <ListGroup variant="flush" style={{textAlign:'center'}}>
                  <ListGroup.Item>{data.length}</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
        )
    }

    render() {
        let chart = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        let details = this.props.value.filters.overviews;
        return (
            <Fragment>
            <Container className="top-container">
                <DataFilters className='dropdown-left' depth={1}/>
                <DataFilters className='dropdown-left' depth={2}/>
                <DataTypes className='dropdown-right'/>
                <DataLocations className='dropdown-right'/>
            </Container>
                <hr/>
			<Container>
				<Row>
				{this.countDetail(details.donors, "Donors")}
				{this.countDetail(details.implementing, "Implementing")}
				{this.countDetail(details.organisations, "Organisations")}
				{this.countDetail(details.all, "All")}
				</Row>
				<Row>{chart}</Row>
			</Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
