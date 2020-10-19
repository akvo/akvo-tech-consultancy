import React, { Component, Fragment, useState } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Redirect } from "react-router-dom";
import { Link, Switch, Route } from 'react-router-dom';
import { Row, Col, Card, Jumbotron, Nav } from "react-bootstrap";
import CountryTab from "./countryTab.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import intersectionBy from "lodash/intersectionBy";
import Loading from '../components/Loading';
import NotFound from './NotFound';

String.prototype.toTitle = function() {
    return this.replace(/(^|\s)\S/g, function(t) {
        return t.toUpperCase();
    });
};

function NavLink({country, company, tab, active}) {
    const tabName = tab.replace('-', ' ').toTitle();
    country = country.toLowerCase();
    return (
        <Nav.Link as={Link} to={"/country/" + country + "/" + company + "/" + tab} active={active}>
            {tab === "resources" ? (<FontAwesomeIcon icon={["fas", "download"]} />) : ""}
            {tabName}
        </Nav.Link>
    )
}


class Country extends Component {

    constructor(props) {
        super(props);
        this.state={
            loading:true,
            redirect:false
        }
    }

    componentWillUnmount() {
        CountryTab;
    }

    componentDidMount() {
        const token = localStorage.getItem("access_token");
        if (token === null) {
            this.setState({redirect:true});
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/not-found" />;
        }
        if (this.props.value.page.loading) {
            return <Loading />
        }
        let params = this.props.match.params;
        let user = this.props.value.user;
        let access = this.props.value.user.forms;
            access = access.map(x => {
                return {...x, id: x.form_id};
            });
        let country = params.country.toTitle();
        let companies = this.props.value.page.filters.find((x) => x.name === country);
            companies = intersectionBy(companies.childrens, access, 'id');
        let companyId = parseInt(params.companyId);
        let resource = access.find(x => x.id === companyId);
        if (!resource) {
            return <Loading />
        }
        let tab = params.tab;
        let tabs = ["overview", "hh-profile", "farmer-profile", "farm-practices"];
            tabs = resource.download ? [...tabs, "resources"] : tabs;
        return (
            <Fragment>
                <Jumbotron className="has-navigation">
                    <Row className="page-header">
                        <Col md={12} className="page-title text-center">
                            <h2>Project in {country}</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className="page-title text-center">
                            <div className="sub-content">
                                { companies.map((x, i) => (
                                    <Link
                                        key={i}
                                        to={"/country/"  + country.toLowerCase() + "/" + x.id + "/overview"}
                                        className={x.id === companyId ? "active" : ""}
                                    >
                                        {x.company}
                                    </Link>
                                )) }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Nav className="align-self-center nav-jumbotron">
                            { tabs.map((x, i) =>
                                <NavLink key={i} active={tab === x} country={country} company={companyId} tab={x}/>
                            )}
                        </Nav>
                    </Row>
                </Jumbotron>
                <div className="page-content has-jumbotron">
                    <Switch>
                        <Route exact path='/country/:country/:companyId/:tab' component={CountryTab} />
                    </Switch>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Country);
