import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faCog,
    faUsers,
    faSignOutAlt,
    faGlobeEurope
} from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from 'react-router-dom';
import { uiText } from '../static/ui-text';
import config from '../config';
import { useLocale, langs } from '../lib/locale-context';
import { useAuth } from "./auth-context";
import Locale from "./Locale.js";
import { SaveFormModal } from "./Modal";

const hideNavBarMenu = (routes, pathname) => {
    const noNavMenuRoutes = new Set();
    noNavMenuRoutes.add(routes.login);
    noNavMenuRoutes.add(routes.register);
    noNavMenuRoutes.add(routes.resetPassword);
    noNavMenuRoutes.add(routes.forgotPassword);
    return noNavMenuRoutes.has(pathname);
};

const Header = ({ formLoaded, setFormLoaded }) => {
    // Locale
    const { user, logout } = useAuth();
    const { locale, update } = useLocale();
    const text = uiText[locale.active];

    const [showSavePrompt, setShowSavePrompt] = useState(false);
    // const showNavBarMenu = !hideNavBarMenu(config.routes, location.pathname);
    // the location.pathname can't be used like this to get the actual route
    // hence setting this to be constantly true for now.
    const showNavBarMenu = true;

    const endSession = async () => {
        await logout();
        setFormLoaded(false);
        window.location.reload();
    };

    return (
        <Navbar bg="light">
            {showNavBarMenu && (
                <>
                    <Navbar.Brand as={Link} to={config.routes.home}>
                        {text.navHome}
                    </Navbar.Brand>
                    <Nav className="mr-auto">
                        {user?.verified && (
                            <>
                                <Nav.Link as={NavLink} to={config.routes.survey}>
                                    { text.navSurvey }
                                </Nav.Link>

                                <Nav.Link as={NavLink} to={config.routes.submission}>
                                    { text.btnDownload }
                                </Nav.Link>
                            </>
                        )}
                        <Nav.Link as={NavLink} to={config.routes.definition}>
                            { text.navDefinitions }
                        </Nav.Link>
                        {user?.verified && (
                            <>
                                <Nav.Link as={NavLink} to={config.routes.feedback}>
                                    { text.navFeedback }
                                </Nav.Link>
                                <Nav.Link as={NavLink} to={config.routes.impressum}>
                                    { text.textFooterImpressum }
                                </Nav.Link>
                                <Nav.Link as={NavLink} to={config.routes.faq}>
                                    { text.textFooterFaq }
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </>
            )}
            <Navbar.Collapse className="justify-content-end">
                <Locale locale={locale} updateLocale={update} />
            </Navbar.Collapse>
            {(showNavBarMenu && user) && (
                <NavDropdown
                    alignRight
                    title={
                        <>
                        <FontAwesomeIcon
                            className="mr-2"
                            icon={faUser}
                        />
                            { user.name }
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
                                { text.navSetting }
                            </NavDropdown.Item>
                            {user.can("manage-users") && (
                                <NavDropdown.Item
                                    as={NavLink}
                                    to={config.routes.users}
                                >
                                    <FontAwesomeIcon
                                        className="mr-2"
                                        icon={faUsers}
                                    />
                                    { text.navManageUser }
                                </NavDropdown.Item>
                            )}
                            <NavDropdown.Divider />
                        </>
                    )}
                    <NavDropdown.Item
                        onClick={e => formLoaded ? setShowSavePrompt(true) : endSession() }>
                        <FontAwesomeIcon
                            className="mr-2"
                            icon={faSignOutAlt}
                        />
                        { text.navLogout }
                    </NavDropdown.Item>
                </NavDropdown>
            )}
            <SaveFormModal
                text={text}
                show={showSavePrompt}
                onHide={e => setShowSavePrompt(false)}
                onConfirm={endSession}
            />
        </Navbar>
    );
};

export default Header;
