import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Row, Col, Button, Table, Dropdown } from "react-bootstrap";
import Charts from "../components/Charts";
import { generateData } from "../charts/chart-generator.js";
import { flatFilters } from '../data/utils.js';
import JumbotronWelcome from "../components/JumbotronWelcome";
import { auth } from "../data/api.js";

const MapsOverride = (TableView, noValue) => {
    let config = {
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 10,
            left: 10,
            data: []
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            padding:0,
            transitionDuration: 0.2,
            formatter: TableView,
            backgroundColor: "#fff",
            position: [0,0],
            textStyle: {
                color: "#222",
                fontFamily: "Gotham"
            }
        }
    }
    return config;
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.TableView = this.TableView.bind(this);
        this.checkAuth = this.checkAuth.bind(this);
        this.state = {
            charts: [],
            redirect: false,
        };
    }

    TableView(params) {
        let project = 'Project';
        let value = 'No Data';
        if (typeof params.data !== 'undefined') {
            value = params.data.value;
            project += (params.data.value > 1) ? 's' : '';
        }
        let html = '<table class="table table-sm table-bordered">';
        html += '<thead class="thead-dark">';
        html += '<tr>';
        html += '<th width="200">Country</th>';
        html += '<th width="50" class="text-right">'+project+'</th>';
        html +='</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '<tr>'
        html += '<td>'+params.name+'</td>';
        html += '<td class="text-right">'+value+'</td>';
        html += '</tr>';
        html += '</tbody>'
        return '<div class="tooltip-maps">' + html + '</div>';
    }

    checkAuth() {
        const token = localStorage.getItem("access_token");
        if (token === null) {
            this.props.user.logout();
            this.setState({redirect:true});
            return;
        }
        if (token) {
            auth(token).then(res => {
                const { status, message } = res;
                if (status === 401) {
                    this.props.user.logout();
                    this.setState({redirect:true});
                }
                return res;
            });
        }
        return;
    }

    componentDidMount() {
        this.props.page.loading(true);
        setTimeout(() => {
            this.checkAuth();
            this.props.page.loading(false);
        }, 1000);
    }
    

    render() {
        if (this.state.redirect) {
            return <Redirect to="/login" />;
        }
        let user = this.props.value.user;
        let page = this.props.value.page;
        let data = page.filters.map((x) => {
            return {
                name: x.name,
                value: x.childrens.length,
            };
        });
        let source = flatFilters(page.filters);
        source = user.id === 0
            ? []
            : source.filter(x => user.forms.find(f => f.form_id === x.id));
        source = source.map(x => {
            return {
                ...x,
                country: x.name.split(' - ')[0]
            }
        });
        data = data.map(x => {
            let first = source.find(s => s.country === x.name);
            let link = false;
            if (first) {
                link = "/country/" + x.name + "/" + first.id + "/overview";
            }
            return {...x, link:link}
        });
        let maps = {
            title: "",
            data: { maps: "world", records: data, override: MapsOverride(this.TableView) },
            kind: "MAPS",
            config: generateData(12, false, "60vh"),
        };
        return (
            <Fragment>
                <JumbotronWelcome text={false}/>
                <div className="page-content has-jumbotron">
                    <Row>
                        <Col md={12}>
                            <Charts identifier={"map-home"} title={maps.title} dataset={maps.data} kind={maps.kind} config={maps.config} />
                        </Col>
                        <Col md={12}>
                            <Table bordered hover size="sm">
                                <thead>
                                    <tr>
                                    <th>Country</th>
                                    <th>Crop</th>
                                    <th>Company</th>
                                    <th>Total Submission</th>
                                    <th>Survey Conducted</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                            {source.map((x, i) => (
                                    <tr key={"tbl-" + i}>
                                    <td>{x.country}</td>
                                    <td>{x.kind}</td>
                                    <td>{x.company}</td>
                                    <td>{x.total}</td>
                                    <td>{x.submission}</td>
                                    <td>
                                        <a target="_blank" href={"/country/" + x.country + "/" + x.id + "/overview"} className="btn btn-sm btn-primary btn-block">
                                            View
                                        </a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
