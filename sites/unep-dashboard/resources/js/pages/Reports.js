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
            fontSize: '14px',
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
                    title: "typeActions",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "100vh"),
                    data: {id: 5, childs:false},
                    extra: {
                        color: ["#00adef","#00adef","#00adef"]
                    }
                },
                {
                    kind: "PIE",
                    title: "roleOrganisation",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "50vh"),
                    data: {id: 77, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "PIE",
                    title: "evaluationActualOutcomes",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "50vh"),
                    data: {id: 112, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "lifecyclePlastics",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "50vh"),
                    data: {id: 140, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "sourceSea",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "75vh"),
                    data: {id: 124, childs:false},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "SANKEY",
                    title: "pollutantTarget",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "120vh"),
                    data: {id: 167, childs:true},
                    extra: {
                        tooltip: {show: false},
                    }
                },
                {
                    kind: "BAR",
                    title: "sector",
                    subtitle: "numberReportedActions",
                    config: generateData(12, true, "95vh"),
                    data: {id: 193, childs: false},
                    extra: {}
                },
                {
                    kind: "PIE",
                    title: "actionTarget",
                    subtitle: "numberReportedActions",
                    config: generateData(6, true, "50vh"),
                    data: {id: 151, childs:false},
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
        let locale = this.props.value.locale.active;
        let thefilter = flatten(this.props.value.page.filters);
            thefilter = thefilter.filter(x => x.id === filterId);
        let datapoints = this.props.value.data.master.map(x => x.values);
            thefilter = getChildsData(thefilter, datapoints, active, locale);
        if (thefilter.length > 0) {
            thefilter = thefilter[0].children;
        }
        if (thefilter.length > 0 && childs === false) {
            thefilter = pushToParent(thefilter, locale)
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
        let lang = this.props.value.locale.lang;
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
            name: lang.reportTitle,
            sortable: true,
            selector: 'title',
            maxWidth:'940px',
        },{
            name: lang.funds + '(USD)',
            sortable: true,
            selector: 'funds',
            right: true,
            cell: row => formatCurrency(row.funds),
        },{
            name: lang.countries,
            sortable: true,
            selector: 'countries',
            maxWidth:'100px',
            right: true
        }];
        let conditionalRowStyles = [
            {
                when: row => row.active,
                style: row => ({
                    backgroundColor: '#f8f9fa',
                })
            }
        ];
        return (
            <Container>
                <Row>
                    <Col md={12}>
                        <DataTable
                            style={{paddingTop:"10px"}}
                            columns={columns}
                            data={data}
                            noHeader={true}
                            customStyles={customStyles}
                            fixedHeader
                            pagination={true}
                            conditionalRowStyles={conditionalRowStyles}
                            fixedHeaderScrollHeight={"70vh"}
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
