import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Container, Row, Button, Col, Card, Image } from "react-bootstrap";
import Navigation from "./Navigation";
import PageThumbs from "./PageThumbs";
import PageDetails from "./PageDetails";
import Filters from "./Filters";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BeatLoader } from "react-spinners";

class Page extends Component {
    constructor(props) {
        super(props);
        this.setPage = this.setPage.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.setFooter = this.setFooter.bind(this);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        const fetchPortfolio = new Promise((resolve, reject) => {
            axios.get("./data/portfolio.json").then(res => {
                this.props.getList(res.data, "PORTFOLIO");
                this.props.setCategories(res.data, "CATEGORIES");
                this.props.setCategories(res.data, "COUNTRIES");
                setTimeout(() => {
                    resolve(true);
                }, 300);
            });
        });

        const fetchPoc = new Promise((resolve, reject) => {
            axios.get("./data/poc.json").then(res => {
                this.props.getList(res.data, "POC");
                this.props.setCategories(res.data, "CATEGORIES");
                this.props.setCategories(res.data, "COUNTRIES");
                setTimeout(() => {
                    resolve(true);
                    let page = window.location.href.split("#");
                    let showPage = false;
                    if (page.length === 2) {
                        if (page[1] !== "") {
                            showPage = true;
                        }
                    }
                    if (showPage) {
                        let category = page[1].split("/")[0];
                        let id = parseInt(page[1].split("/")[1]);
                        this.props.showSubPage(id, category.toUpperCase());
                        this.props.changePage(category);
                    }
                    this.setState({isLoading:false});
                }, 300);
            });
        });

        fetchPortfolio.then(res => fetchPoc);
    }

    sendEmail() {
        window.location.assign("mailto:joy@akvo.org");
    }

    contactThumbnail() {
        return (
            <Col className="container-thumbnails" xs={12} sm={6} md={4}>
                <Card>
                    <Card.Body className="end-poc">
                        <h1>do you want to get involved in the research?</h1>
                    </Card.Body>
                    <Card.Footer className="thumbnails-footer">
                        <div className="text-center">
                            <Button variant="primary" className="btn-card" onClick={this.sendEmail}>
                                <FontAwesomeIcon icon={["fas", "envelope"]} /> Contact Us
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </Col>
        )
    }

    setPage(page) {
        let captions = this.props.value.captions ? "" : " tagline-hidden";
        console.log(this.state.isLoading);
        if (this.state.isLoading) {
            return (
                <Container style={{ marginTop: 30 + "px" }}>
                    <Row>
                        <Col xs={12}>
                            <BeatLoader css="margin-top:35%; text-align:center;" size={20} color={"#03ad8c"} />
                        </Col>
                    </Row>
                </Container>
            )
        }
        return (
            <Fragment>
                <div className="mobile-header-image">
                    <h1>Tech Consultancy Team</h1>
                    <Image src={`${process.env.PUBLIC_URL}/images/slider-01.jpg`} />
                </div>
                <div className={"tagline" + captions}>
                    <Container>
                        <h1 className="text-center">Portfolios</h1>
                        <h3>With building something on-top, the solutions are built with robust products like Akvo’s as the core workhorse, and then a layer of customisations which goes sufficiently close to aligning with the partner requirements.</h3>
                    </Container>
                </div>
                { this.props.value.captions ? "" : (
                    <Container className={"filter-list"}>
                        <Row>
                            <Col xs={6}>
                                <Col xs={1} className={"filter-name"}>Types</Col>
                                <Col xs={11}><Filters type="categories"/></Col>
                            </Col>
                            <Col xs={6}>
                                <Col xs={1} className={"filter-name"}>Countries</Col>
                                <Col xs={11}><Filters type="countries"/></Col>
                            </Col>
                        </Row>
                    </Container>
                    )
                }
                <Container style={{ marginTop: 30 + "px" }}>
                    <Row>
                        <PageThumbs lists="portfolio" />
                    </Row>
                </Container>
                <div className={"tagline tagline-poc" + captions}>
                    <Container>
                        <h1>Proof of Concepts</h1>
                        <h3>Evidence, typically derived from an experiment or pilot project, which demonstrates that a design concept, business proposal, etc., is feasible.</h3>
                    </Container>
                </div>
                <Container style={{ marginTop: 30 + "px" }}>
                    <Row>
                        <PageThumbs lists="poc" />
                        {this.contactThumbnail()}
                    </Row>
                </Container>
            </Fragment>
        );
    }

    showPageDetails() {
        return (
            <Container style={{ marginTop: 30 + "px" }}>
                <Row>
                    <PageDetails type={this.props.value.page} />
                </Row>
            </Container>
        );
    }

    setFooter() {
        return (
            <div className="footer">
                <Container>
                    <p>
                        We apply the principles of open source software, open content and open data to all of our work.
                        <br />
                        Find out <a href="https://akvo.org/blog/open-data-content-and-software-at-akvo/">why and how</a>.
                    </p>
                </Container>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
                <Navigation />
                {this.props.value.page === "home" ? this.setPage("main") : this.showPageDetails()}
                {this.state.isLoading ? "" : this.setFooter()}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
