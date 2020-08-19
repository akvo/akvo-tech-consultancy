import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Col, Row, Container } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../data/chart-utils.js";
import {
    flatten,
    getChildsData,
    pushToParent,
    formatCurrency
} from "../data/utils.js";
import DataTable from 'react-data-table-component';

const customStyles = {
    headCells: {
        style: {
            backgroundColor: '#f1f1f5',
            borderColor: '#454d55',
            fontWeight: 'bold',
            color: '#222',
            width: '100%',
            maxWidth: '100%'
        },
    },
};

class Reports extends Component {
    constructor(props) {
        super(props);
        this.getCharts = this.getCharts.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.getReportTable = this.getReportTable.bind(this);
        this.reportToggle = this.reportToggle.bind(this);
        this.state = {
            charts: [
                {
                    kind: "TREEMAP",
                    title: "Type of Actions",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "100vh"),
                    data: {id: 5, childs:false},
                    extra: {
                        color: ["#00adef","#00adef","#00adef"]
                    }
                },
                {
                    kind: "PIE",
                    title: "Role of Organisation",
                    subtitle: "Count of Actions",
                    config: generateData(6, true, "50vh"),
                    data: {id: 77, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "PIE",
                    title: "Evaluation of Actual Outcomes",
                    subtitle: "Count of Actions",
                    config: generateData(6, true, "50vh"),
                    data: {id: 112, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "Lifecycle of Plastics",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "50vh"),
                    data: {id: 139, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "Source to Sea",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "75vh"),
                    data: {id: 123, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "SANKEY",
                    title: "Pollutant Target",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "120vh"),
                    data: {id: 166, childs:true},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "Sector",
                    subtitle: "Count of Actions",
                    config: generateData(12, true, "95vh"),
                    data: {id: 192, childs: false},
                    extra: {}
                },
                {
                    kind: "PIE",
                    title: "Action Target",
                    subtitle: "Count of Actions",
                    config: generateData(6, true, "50vh"),
                    data: {id: 150, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
            ]
        }
    }

    componentDidMount() {
        this.props.report.reset();
    }

    renderOptions(filterId, childs=true) {
        let active = this.props.value.reports.list;
        let thefilter = flatten(this.props.value.page.filters);
            thefilter = thefilter.filter(x => x.id === filterId);
        let datapoints = this.props.value.data.master.map(x => x.values);
            thefilter = getChildsData(thefilter, datapoints, active);
        if (thefilter.length > 0) {
            thefilter = thefilter[0].children;
        }
        if (thefilter.length > 0 && childs === false) {
            thefilter = pushToParent(thefilter)
        }
        return thefilter;
    }

    getCharts(list, index) {
        let data = this.renderOptions(list.data.id, list.data.childs);
        return (
            <Charts
                key={index}
                title={list.title}
                subtitle={list.subtitle}
                kind={list.kind}
                config={list.config}
                dataset={data}
                extra={list.extra}
                reports={true}
            />
        )
    }

    reportToggle(x) {
        if (x.active) {
            return this.props.report.delete(x.datapoint_id);
        }
        return this.props.report.append(x.datapoint_id);
    }

    getReportTable() {
        let datapoints = this.props.value.data.filteredpoints;
        datapoints = this.props.value.data.datapoints.filter(x => datapoints.includes(x.datapoint_id));
        return datapoints.map((x,id) => {
            return {
                uuid: x.uuid,
                datapoint_id: x.datapoint_id,
                active: this.props.value.reports.list.includes(x.datapoint_id),
                icon: this.props.value.reports.list.includes(x.datapoint_id) ? "plus" : "check",
                title:x.title,
                countries: x.countries.length,
                funds: x.f
            }
        })
    }

    render() {
        let charts = this.state.charts.map((list, index) => {
            return this.getCharts(list, index)
        });
        let data = this.getReportTable();
        let columns = [{
            name: 'A',
            selector: 'icon',
            sortable: true,
            cell: row => (
                <FontAwesomeIcon
                    className="fas-icon"
                    color={row.active ? "green" : "grey"}
                    icon={["fas", row.active ? "check-circle" : "plus-circle"]}
                />
            ),
            width: '50px',
            maxWidth: '50px',
        },{
            name: 'UUID',
            sortable: true,
            selector: 'uuid',
            maxWidth:'180px',
        },{
            name: 'Report Title',
            sortable: true,
            selector: 'title',
            maxWidth:'940px',
        },{
            name: 'Funds (USD)',
            sortable: true,
            selector: 'funds',
            right: true,
            cell: row => formatCurrency(row.funds),
        },{
            name: 'Countries',
            sortable: true,
            selector: 'countries',
            maxWidth:'100px',
            right: true
        }];
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <DataTable
                            columns={columns}
                            data={data}
                            customStyles={customStyles}
                            fixedHeader
                            fixedHeaderScrollHeight={"55vh"}
                            onRowClicked={this.reportToggle}
                            highlightOnHover
                            pointerOnHover
                        />
                    </Col>
                </Row>
                <Row className="report-chart-list">
                    {charts}
                </Row>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
