import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import {
    Row,
    Col,
    Jumbotron,
    Card
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from 'react-data-table-component';
import Loading from '../components/Loading';
import { userLogs } from "../data/api";
import { flatFilters } from '../data/utils.js';

const customTableStyle = {
    rows: {
        style: {
            cursor: "pointer"
        }
    }
}

const tableColumns = [
    {
        name: 'Name',
        selector: 'name',
        sortable: true,
    },
    {
        name: 'Role',
        selector: 'role',
        sortable: true,
    },
    {
        name: 'Log',
        selector: 'log',
        sortable: true,
    },
    {
        name: 'Date',
        selector: 'at',
        sortable: true,
    }
]


class Logs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            logs: [
                {
                    name: "Loading",
                    role: "Loading",
                    log: "Loading",
                    at: "Loading"
                }
            ]
        }
    }

    componentDidMount() {
        const token = localStorage.getItem("access_token");
        if (token === null) {
            this.setState({redirect:true});
            return;
        }
        userLogs().then(res => {
            let forms = flatFilters(this.props.value.page.filters);
            forms = forms.map(x => {
                let file = x.name.split(" ")[0].toLowerCase();
                    file += "-" + x.company.toLowerCase().replace(' ', '_');
                    file = file.replace(" ", "_");
                return {
                    id: x.id,
                    log: "Downloaded " + file + ".xlsx"
                }
            });
            res = res.map(x => {
                let log = forms.find(f => f.id === x.form_id);
                return {
                    ...x,
                    log: log.log
                }
            });
            this.setState({logs: res});
        });
    }

    render() {
        let user = this.props.value.user;
        if (this.props.value.page.loading) {
            return <Loading />
        }
        if (this.state.redirect) {
            return <Redirect to="/not-found" />;
        }
        return (
            <>
                <Jumbotron>
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Welcome to IDH Dataportal</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content has-jumbotron">
                    <Row className="justify-content-md-center">
                        <Col md={12}>
                            <Card>
                            <Card.Header>
                                <FontAwesomeIcon className="mr-2" icon={["fas", "history"]} /> User Logs
                            </Card.Header>
                            <Card.Body style={{padding: "0px"}}>
                            <DataTable
                                className="table table-bordered table-sm"
                                columns={tableColumns}
                                data={this.state.logs}
                                noHeader={true}
                                fixedHeader={true}
                                fixedHeaderScrollHeight={"500px"}
                                defaultSortField="name"
                                customStyles={customTableStyle}
                                highlightOnHover={true}/>
                            </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
