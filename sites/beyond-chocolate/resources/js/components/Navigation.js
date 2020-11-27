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
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./auth-context";
import config from "../config";
import { useLocale } from "../lib/locale-context";

const Navigation = () => {
    const { user, logout } = useAuth();
    const { locale, update } = useLocale();
    const endSession = async () => {
        await logout();
        window.location.reload();
    };

    const handleLocale = (lang) => {
        update({...locale, active:lang});
    };

    return (
        <Navbar expand="lg">
            <Navbar.Brand as={Link} to="/">
                cho-cooperative
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user?.verified && (
                        <Nav.Link as={NavLink} to={config.routes.home}>
                            Survey
                        </Nav.Link>
                    )}
                    <Nav.Link as={NavLink} to="/definition">
                        Definition
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/feedback">
                        Feedback
                    </Nav.Link>
                </Nav>

                <Nav>
                    {false && (
                        <Form inline>
                            <FormControl
                                type="text"
                                placeholder="Search"
                                className="mr-sm-2"
                            />
                        </Form>
                    )}
                    <NavDropdown
                        id="localeSelect"
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
                        <NavDropdown.Item onClick={e => handleLocale('en')} href="#en">English</NavDropdown.Item>
                        <NavDropdown.Item onClick={e => handleLocale('de')} href="#de">German</NavDropdown.Item>
                        {/* <NavDropdown.Item onClick={e => handleLocale('fr')} href="#fr">French</NavDropdown.Item> */}
                    </NavDropdown>
                    {user && (
                        <NavDropdown
                            alignRight
                            title={
                                <>
                                    <FontAwesomeIcon
                                        className="mr-2"
                                        icon={faUser}
                                    />
                                    {user.name}
                                </>
                            }
                        >
                            {user.verified && (
                                <>
                                    <NavDropdown.Item href="#settings">
                                        <FontAwesomeIcon
                                            className="mr-2"
                                            icon={faCog}
                                        />
                                        Settings
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/users">
                                        <FontAwesomeIcon
                                            className="mr-2"
                                            icon={faUsers}
                                        />
                                        Manage User
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                </>
                            )}
                            <NavDropdown.Item onClick={endSession}>
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faSignOutAlt}
                                />
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
