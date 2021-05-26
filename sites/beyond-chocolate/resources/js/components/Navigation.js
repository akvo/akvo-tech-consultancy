import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Form, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faCog,
    faUsers,
    faHistory,
    faSignOutAlt,
    faGlobeEurope,
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./auth-context";
import config from "../config";
import { useLocale, langs } from "../lib/locale-context";
import { uiText } from "../static/ui-text";
import { SaveFormModal } from "./Modal";

const hideNavBarMenu = (routes, pathname) => {
    const noNavMenuRoutes = new Set();
    noNavMenuRoutes.add(routes.login);
    noNavMenuRoutes.add(routes.register);
    noNavMenuRoutes.add(routes.resetPassword);
    noNavMenuRoutes.add(routes.forgotPassword);
    return noNavMenuRoutes.has(pathname);
};

const Navigation = ({ formLoaded, setFormLoaded }) => {
    const { user, logout } = useAuth();
    const { locale, update } = useLocale();
    const location = useLocation();
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const showNavBarMenu = !hideNavBarMenu(config.routes, location.pathname);

    let text = uiText[locale.active];

    const endSession = async () => {
        await logout();
        setFormLoaded(false);
        window.location.reload();
    };

    const handleLocale = (eventKey) => {
        console.log(eventKey);
        update({ ...locale, active: eventKey });
    };

    return (
        <Navbar expand="lg">
            {showNavBarMenu && (
                <Navbar.Brand as={Link} to={config.routes.home}>
                    {text.navHome}
                </Navbar.Brand>
            )}
            <Navbar.Toggle aria-controls="basiqc-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user?.verified && (
                        <>
                            {/* <Nav.Link as={NavLink} to={config.routes.gettingStarted}>
                                { text.navGettingStarted }
                            </Nav.Link> */}
                            <Nav.Link as={NavLink} to={config.routes.survey}>
                                {text.navSurvey}
                            </Nav.Link>

                            <Nav.Link
                                as={NavLink}
                                to={config.routes.submission}
                            >
                                {text.btnDownload}
                            </Nav.Link>
                        </>
                    )}
                    {showNavBarMenu && (
                        <Nav.Link as={NavLink} to={config.routes.definition}>
                            {text.navDefinitions}
                        </Nav.Link>
                    )}
                    {user?.verified && (
                        <>
                            <Nav.Link as={NavLink} to={config.routes.feedback}>
                                {text.navFeedback}
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={config.routes.impressum}>
                                {text.textFooterImpressum}
                            </Nav.Link>
                            <Nav.Link as={NavLink} to={config.routes.faq}>
                                {text.textFooterFaq}
                            </Nav.Link>
                        </>
                    )}
                </Nav>

                <Nav activeKey={locale.active} onSelect={handleLocale}>
                    {false && (
                        <Form inline>
                            <FormControl
                                type="text"
                                placeholder={text.navSearch}
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
                                {langs[locale.active]}
                            </>
                        }
                    >
                        <NavDropdown.Item eventKey="en">
                            {langs.en}
                        </NavDropdown.Item>
                        <NavDropdown.Item eventKey="de">
                            {langs.de}
                        </NavDropdown.Item>
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
                                    <NavDropdown.Item
                                        as={NavLink}
                                        to={config.routes.setting}
                                    >
                                        <FontAwesomeIcon
                                            className="mr-2"
                                            icon={faCog}
                                        />
                                        {text.navSetting}
                                    </NavDropdown.Item>
                                    {user.can("manage-users") && (
                                        <>
                                            <NavDropdown.Item
                                                as={NavLink}
                                                to={config.routes.users}
                                            >
                                                <FontAwesomeIcon
                                                    className="mr-2"
                                                    icon={faHistory}
                                                />
                                                {text.navManageUser}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                as={NavLink}
                                                to={config.routes.activity}
                                            >
                                                <FontAwesomeIcon
                                                    className="mr-2"
                                                    icon={faHistory}
                                                />
                                                {text.navManageUser}
                                            </NavDropdown.Item>
                                        </>
                                    )}
                                    <NavDropdown.Divider />
                                </>
                            )}
                            <NavDropdown.Item
                                onClick={(e) =>
                                    formLoaded
                                        ? setShowSavePrompt(true)
                                        : endSession()
                                }
                            >
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faSignOutAlt}
                                />
                                {text.navLogout}
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Navbar.Collapse>
            <SaveFormModal
                text={text}
                show={showSavePrompt}
                onHide={(e) => setShowSavePrompt(false)}
                onConfirm={endSession}
            />
        </Navbar>
    );
};

export default Navigation;
