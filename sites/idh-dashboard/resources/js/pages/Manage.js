import React, { Component, Fragment } from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import {
    Row,
    Col,
    Form,
    Button,
    Alert,
    Jumbotron,
    Card,
    ListGroup,
    InputGroup,
    DropdownButton,
    Dropdown
} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { flatFilters, initialNotification } from '../data/utils.js';
import { getUser , accessUser } from "../data/api";
import DataTable from 'react-data-table-component';
import intersectionBy from "lodash/intersectionBy";
import Loading from '../components/Loading';

const customTableStyle = {
    rows: {
        style: {
            cursor: "pointer"
        }
    }
}

const initialPropsForm = [
    {
        id:0,
        access:0//0 revoke,1 read,2 full access
    }
];

const tableColumns = [
    {
        name: 'Name',
        selector: 'name',
        sortable: true,
    },
    {
        name: 'Email',
        selector: 'email',
        sortable: true,
    },
    {
        name: 'Role',
        selector: 'role',
        sortable: true,
    },
    {
        name: 'SDM Access',
        selector: 'formLength',
        sortable: true,
    }
]

class Manage extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAccess = this.handleAccess.bind(this);
        this.renderForms = this.renderForms.bind(this);
        this.renderCountries = this.renderCountries.bind(this);
        this.searchEmail = this.searchEmail.bind(this);
        this.renderDetail = this.renderDetail.bind(this);
        this.showDetail = this.showDetail.bind(this);
        this.state = {
            error: "",
            admin: this.props.value.user,
            messages: {
                user: {type:"success", message:""},
            },
            notification: initialNotification,
            users: [{
                name: "Loading",
                role: "Loading",
                forms: [{
                    id: 0,
                    access: 0
                }]
            }],
            selected: 0,
            forms: [{
                id: 0,
                access:0
            }],
            redirect: false
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        if (token === null) {
            return;
        }
        let user = this.state.users.find(x => x.selected);
        accessUser(token, user).then(res => {
            this.setState({notification:res});
            setTimeout(() => {
                this.setState({notification:initialNotification})
            }, 3000)
        });
    }

    handleAccess(id, access) {
    }

    searchEmail() {
    }

    showDetail(user) {
        this.setState({selected: user.id});
    }

    renderDetail() {
    }

    renderForms(country, ix) {
    }

    renderCountries(countries) {
    }

    componentDidMount() {
        const token = localStorage.getItem("access_token");
        if (token === null) {
            this.setState({redirect:true});
        }
        if (token !== null) {
            getUser(token).then(res => {
                if (res === "unauthorized") {
                    this.setState({redirect: true});
                }
                if (res !== "unauthorized") {
                    let users = res.map(x => {
                        return {
                            ...x, formLength: x.role !== 'user' ? "All" : x.forms.length
                        }
                    })
                    this.setState({users: users});
                }
            });
        }
    }

    render() {
        const conditionalRowStyles = [
          {
            when: row => row.id === this.state.selected,
            style: {
                backgroundColor: '#ebf7ff',
            },
          },
        ];
        let admin = this.state.admin;
        let error = this.state.error === "" ? false : this.state.error;
        let notification = this.state.notification;
        let forms = flatFilters(this.props.value.page.filters);
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
                            <h2>{"Welcome " + admin.name}!</h2>
                        </Col>
                    </Row>
                </Jumbotron>
                <div className="page-content has-jumbotron">
                    {notification.active ? (
                        <Row className="justify-content-md-center">
                        <Col md={12}>
                        <Alert
                            variant={notification.variant}
                            onClose={() => this.setState({ notification: {...notification, active: false} })}
                            dismissible>
                            {notification.message}
                        </Alert>
                        </Col>
                        </Row>
                    ) : ("")}
                    <Row className="justify-content-md-center">
                        <Col md={7}>
                            <Card>
                            <Card.Header>Users</Card.Header>
                            <Card.Body style={{padding: "0px"}}>
                            <DataTable
                                className="table table-bordered table-sm"
                                columns={tableColumns}
                                data={this.state.users}
                                noHeader={true}
                                fixedHeader={true}
                                fixedHeaderScrollHeight={"500px"}
                                onRowClicked={this.showDetail}
                                defaultSortField="name"
                                conditionalRowStyles={conditionalRowStyles}
                                customStyles={customTableStyle}
                                highlightOnHover={true}/>
                            </Card.Body>
                            </Card>
                        </Col>
                        <Col md={5}>
                            <Card>
                            <Card.Header>User</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={8}>
                                            Name
                                        </Col>
                                        <Col md={4} align={"right"}>
                                            Annemae Wyman II
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={8}>
                                            Role
                                        </Col>
                                        <Col md={4} align={"right"}>
                                            <DropdownButton
                                                alignRight
                                                size="sm"
                                                title="User"
                                                id="dropdown-menu-align-right"
                                                className="dropdown-show-sm"
                                            >
                                                <Dropdown.Item className="dropdown-item-sm">Admin</Dropdown.Item>
                                                <Dropdown.Item className="dropdown-item-sm">Analyst</Dropdown.Item>
                                                <Dropdown.Item className="dropdown-item-sm">General Staff</Dropdown.Item>
                                                <Dropdown.Item className="dropdown-item-sm">Guest</Dropdown.Item>
                                            </DropdownButton>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={12}>
                                            <Button size="sm" variant={"danger"} block>Delete User</Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                            </Card>
                        <hr/>
                            <Card>
                            <Card.Header>Access</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col md={8}>
                                            Kenya Mwa Rice
                                        </Col>
                                        <Col md={4} align={"right"}>
                                            <DropdownButton
                                                variant={"secondary"}
                                                alignRight
                                                size="sm"
                                                title="No Access"
                                                id="dropdown-menu-align-right"
                                                className="dropdown-show-sm"
                                            >
                                                <Dropdown.Item className="dropdown-item-sm">Read Access</Dropdown.Item>
                                                <Dropdown.Item className="dropdown-item-sm">Full Access</Dropdown.Item>
                                            </DropdownButton>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col md={8}>
                                            Egranary
                                        </Col>
                                        <Col md={4} align={"right"}>
                                            <DropdownButton
                                                variant={"success"}
                                                alignRight
                                                size="sm"
                                                title="Full Access"
                                                id="dropdown-menu-align-right"
                                                className="dropdown-show-sm"
                                            >
                                                <Dropdown.Item className="dropdown-item-sm">No Access</Dropdown.Item>
                                                <Dropdown.Item className="dropdown-item-sm">View Access</Dropdown.Item>
                                            </DropdownButton>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Manage);
