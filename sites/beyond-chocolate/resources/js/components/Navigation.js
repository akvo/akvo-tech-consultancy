import React from "react";
import { Navbar, Nav, NavDropdown, Form, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faCog,
    faUsers,
    faSignOutAlt,
    faGlobeEurope
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Navigation = function() {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to="/">
                Beyond Chocolate
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#">Home</Nav.Link>
                    <NavDropdown title="Country" id="basic-nav-dropdown">
                        <NavDropdown.Item href="#">Kenya</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#">Compare</Nav.Link>
                </Nav>

                <Nav>
                    <Form inline>
                        <FormControl
                            type="text"
                            placeholder="Search"
                            className="mr-sm-2"
                        />
                    </Form>
                    <NavDropdown
                        title={
                            <>
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faGlobeEurope}
                                />
                                DE
                            </>
                        }
                    >
                        <NavDropdown.Item href="#en">English</NavDropdown.Item>
                        <NavDropdown.Item href="#de">German</NavDropdown.Item>
                        <NavDropdown.Item href="#fr">French</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                        alignRight
                        title={
                            <>
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faUser}
                                />
                                John Doe
                            </>
                        }
                    >
                        <NavDropdown.Item href="#">
                            <FontAwesomeIcon className="mr-2" icon={faCog} />
                            Settings
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/users">
                            <FontAwesomeIcon className="mr-2" icon={faUsers} />
                            Manage User
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#">
                            <FontAwesomeIcon
                                className="mr-2"
                                icon={faSignOutAlt}
                            />
                            Logout
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
