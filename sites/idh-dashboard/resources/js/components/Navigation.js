import React, { Component } from "react";
import { redux } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { connect } from "react-redux";
import { Link, NavLink, Redirect } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container, Dropdown, Image, Form, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { flatFilters } from '../data/utils.js';
import intersectionBy from "lodash/intersectionBy";

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.renderCountries = this.renderCountries.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.changeSearchItem = this.changeSearchItem.bind(this);
        this.renderSearchItem = this.renderSearchItem.bind(this);
        this.endSession = this.endSession.bind(this);
        this.state = {
            searched: [],
            location: false
        }
    }

    handleLocation() {
        let location = window.location.pathname.split('/');
            location = location[1];
        this.setState({location:location});
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

    changeSearchItem(e) {
        this.setState({searched:[]})
        if (e.target.value === "") {
            return;
        }
        let keywords = e.target.value.toLowerCase().split(' ');
        let source = flatFilters(this.props.value.page.filters);
        source = source.map(x => ({
            ...x,
            name: x.name + " - " + x.company
        }));
        let access = this.props.value.user.forms;
            access = access.map(x => {
                return {...x, id: x.form_id};
            });
            source = intersectionBy(source, access, 'id');
        let results = source.map(x => {
            let score = 0;
            let names = x.name.toLowerCase();
            names = names.split(' ');
            names.forEach(x => {
                keywords.forEach(k => {
                    score += x.startsWith(k) ? 1 : 0;
                })
            });
            return {
                ...x,
                score: score
            }
        });
        results = results.filter(x => x.score > 0);
        results = results.map(x => {
            return {
                ...x,
                url: "/country/" + x.name.split(' ')[0].toLowerCase() + "/" + x.id + "/overview"
            }
        });
        this.setState({searched: results});
        return;
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

    renderSearchItem() {
        let data = this.state.searched;
        let items = this.props.value.page.compare.items;
        data = data.filter(x => !items.find(z => z.id === x.id));
        return data.map((x, i) => {
            return (
                <div
                    onClick={e => window.open(x.url)}
                    className="search-suggest"
                    key={'item-' + x.id}>
                    {x.name}
                </div>
            )
        })
    }

    componentWillUnmount() {
        window.removeEventListener('onload', this.handleLocation);
        window.removeEventListener('popstate', this.handleLocation);
        window.removeEventListener('click', this.handleLocation);
    }

    componentDidMount() {
        window.addEventListener('click', this.handleLocation);
        window.addEventListener('popstate', this.handleLocation);
        window.addEventListener('onload', this.handleLocation);
    }


    render() {
        let page = this.props.value.page;
        let user = this.props.value.user;
        let loginText = user.login ? user.name.split(" ")[0] : "Login";
        let location = this.state.location || window.location.pathname.split('/')[1]
            location = location === "logs"
            || location === "manage-user"
            || location === "setting" ?  "manager" : location
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
                                <NavLink className="nav-link" activeClassName="active" to="/home">
                                    Home
                                </NavLink>
                                <NavDropdown
                                    className={location === "country" ? "active" : ""}
                                    title="Country"
                                >
                                    {this.renderCountries()}
                                </NavDropdown>
                                <NavLink className="nav-link" activeClassName="active" to="/compare">
                                    Compare
                                </NavLink>
                            </>
                        ) : (
                            ""
                        )}
                    </Nav>
                    <Nav className="justify-content-end">
                        {user.login ? (
                        <Form inline>
                          <FormControl
                              onChange={this.changeSearchItem}
                              type="text"
                              placeholder="Search"
                              className="mr-sm-2 ml-sm-2 search-nav"
                            />
                            {this.state.searched.length !== 0 ? (
                                <div className="search-item-nav">{this.renderSearchItem()}</div>
                            ) : ""}
                        </Form>
                        ) : ""}
                        <Nav.Item>
                            {user.login ? (
                                <NavDropdown
                                    className={location === "manager" ? "active dropdown-right" : "dropdown-right"}
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
                                        <>
                                        <NavDropdown.Item as={Link} to="/manage-user">
                                        <FontAwesomeIcon className="mr-2" icon={["fas", "user"]} /> Manage User
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/logs">
                                        <FontAwesomeIcon className="mr-2" icon={["fas", "history"]} /> Logs
                                        </NavDropdown.Item>
                                        </>
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
