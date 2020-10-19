import React, { Component } from "react";
import { redux } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Dropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import intersectionBy from "lodash/intersectionBy";

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.renderCountries = this.renderCountries.bind(this);
        this.endSession = this.endSession.bind(this);
    }

    renderCountries() {
        let access = this.props.value.user.forms;
        access = access.map((x) => {
            return { ...x, id: x.form_id };
        });
        let filters = this.props.value.page.filters;
        filters = filters.map((x) => {
            let childs = intersectionBy(x.childrens, access, "id");
            return { ...x, childrens: childs };
        });
        filters = filters.filter((x) => x.childrens.length !== 0);
        return filters.map((c) => {
            let url = "/country/" + c.name.toLowerCase() + "/" + c.childrens[0].id + "/overview";
            return (
                <NavDropdown.Item key={c.name} as={Link} to={url}>
                    {c.name}
                </NavDropdown.Item>
            );
        });
    }

    endSession() {
        this.props.page.compare.reset();
        this.props.user.logout();
        let access_token = localStorage.getItem("access_token");
        if (access_token !== null) {
            localStorage.removeItem("access_token");
        }
        window.location.href = "/login";
    }

    render() {
        let page = this.props.value.page;
        let user = this.props.value.user;
        let loginText = user.login ? user.name.split(" ")[0] : "Login";
        return (
            <Navbar fixed="top" variant="light" className="NavBlue" expand="lg" style={{ padding: "0px" }}>
                <Navbar.Brand as={Link} to="/" style={{ padding: "0px" }}>
                    <Image src={"/images/logo-farmfit.png"} height="60px" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        {user.login ? (
                            <>
                                <Nav.Link as={Link} to="/">
                                    Home
                                </Nav.Link>
                                <NavDropdown title="Country">{this.renderCountries()}</NavDropdown>
                                <Nav.Link as={Link} to="/compare">
                                    Compare
                                </Nav.Link>
                            </>
                        ) : (
                            ""
                        )}
                    </Nav>
                    <Nav className="justify-content-end">
                        <Nav.Item>
                            {user.login ? (
                                <NavDropdown
                                    className={"dropdown-right"}
                                    title={
                                        <div style={{ display: "inline-block" }}>
                                            <FontAwesomeIcon className="mr-2" icon={["fas", "user"]} />
                                            {loginText}
                                        </div>
                                    }
                                >
                                    <NavDropdown.Item as={Link} to="/setting">
                                        <FontAwesomeIcon className="mr-2" icon={["fas", "cogs"]} /> Settings
                                    </NavDropdown.Item>
                                    {user.role === "admin" ? (
                                        <NavDropdown.Item as={Link} to="/manage-user">
                                        <FontAwesomeIcon className="mr-2" icon={["fas", "user"]} /> Manage User
                                        </NavDropdown.Item>
                                    ) : (
                                        ""
                                    )}
                                    <NavDropdown.Item onClick={e => this.endSession()}>
                                        <FontAwesomeIcon className="mr-2" icon={["fas", "sign-out-alt"]} /> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={Link} to="/login">
                                    <FontAwesomeIcon className="mr-2" icon={["fas", "lock"]} /> {loginText}
                                </Nav.Link>
                            )}
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
