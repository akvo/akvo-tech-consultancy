import React, { useState } from "react";
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
import { useLocale, langs } from "../lib/locale-context";
import { uiText } from "../static/ui-text";
import { SaveFormModal } from "./Modal";

const Navigation = ({formLoaded, setFormLoaded}) => {
    const { user, logout } = useAuth();
    const { locale, update } = useLocale();
    const [showSavePrompt, setShowSavePrompt] = useState(false);

    let text = uiText[locale.active];

    const endSession = async () => {
        await logout();
        setFormLoaded(false);
        window.location.reload();
    };

    const handleLocale = eventKey => {
        update({ ...locale, active: eventKey });
    };

    return (
        <Navbar expand="lg">
            <Navbar.Brand as={Link} to={config.routes.home}>
                Gisco
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user?.verified && (
                        <>
                            <Nav.Link as={NavLink} to={config.routes.survey}>
                                { text.navSurvey }
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
                            <NavDropdown.Item onClick={e => formLoaded ? setShowSavePrompt(true) : endSession() }>
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faSignOutAlt}
                                />
                                { text.navLogout }
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Navbar.Collapse>
          <SaveFormModal
            text={text}
            show={showSavePrompt}
            onHide={e => setShowSavePrompt(false)}
            onConfirm={endSession}
          />
        </Navbar>
    );
};

export default Navigation;
