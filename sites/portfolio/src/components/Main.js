import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { Container, Row, Button } from 'react-bootstrap';
import {
    Col,
    Card,
} from 'react-bootstrap';
import Navigation from './Navigation';
import PageThumbs from './PageThumbs';
import PageDetails from './PageDetails';
import Slider from './Slider';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Page extends Component {

    constructor(props) {
        super(props);
        this.setPage = this.setPage.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    componentDidMount() {
        const fetchPortfolio = new Promise ((resolve, reject) =>{
            axios.get('./data/portfolio.json')
                .then(res => {
                    this.props.getList(res.data, "PORTFOLIO");
                    setTimeout(() => {
                        resolve(true);
                    },300)
                });
        });

        const fetchPoc = new Promise ((resolve, reject) =>{
            axios.get('./data/poc.json')
                .then(res => {
                    this.props.getList(res.data, "POC");
                    setTimeout(() => {
                        resolve(true);
                    },300)
                });
        });

        fetchPortfolio.then(res => fetchPoc);
    }

    sendEmail(){
        window.location.assign('mailto:joy@akvo.org');
    }

    setPage (page) {
        return (
            <Fragment>
            <Slider/>
                <div className="tagline">
                    <Container>
                    <h3>
                        With building something on-top, the solutions are built with robust products like Akvo’s as the core workhorse, and then a layer of customisations which goes sufficiently close to aligning with the partner requirements.
                    </h3>
                    <Button variant="light" size="lg">
                        Get in Touch
                    </Button>
                    </Container>
                </div>
            <Container style={{marginTop: 30 +"px"}}>
                <Row>
                    <PageThumbs lists="portfolio"/>
                </Row>
            </Container>
                <div className="tagline tagline-poc">
                    <Container>
                    <h1>Proof of Concepts</h1>
                    <h3>
                        Evidence, typically derived from an experiment or pilot project, which demonstrates that a design concept, business proposal, etc., is feasible.
                    </h3>
                    <Button variant="light" size="lg">
                        Check it Out
                    </Button>
                    </Container>
                </div>
            <Container style={{marginTop: 30 +"px"}}>
                <Row>
                    <PageThumbs lists="poc"/>
                    <Col className='container-thumbnails' xs={4}>
                        <Card>
                            <Card.Body className="end-poc">
                                <h1>
                                    do you want to get involved in the research?
                                </h1>
                            </Card.Body>
                            <Card.Footer className="thumbnails-footer">
                                <div className="text-center">
                                <Button
                                    variant="primary"
                                    className="btn-card"
                                    onClick={this.sendEmail}
                                >
                                    <FontAwesomeIcon icon={["fas", "envelope"]} /> Contact Us
                                </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
            </Fragment>
        )
    }

    showPageDetails () {
        return (
            <Container style={{marginTop: 30 +"px"}}>
                <Row>
                    <PageDetails type={this.props.value.page}/>
                </Row>
            </Container>
        )
    }

    render() {
        return (
            <Fragment>
                <Navigation/>
                { this.props.value.page === "home" ? this.setPage('main') : this.showPageDetails() }
                <div className="footer">
                    <Container>
                    <p>
                        We apply the principles of open source software, open content and open data to all of our work.<br/>
                        Find out <a href="https://akvo.org/blog/open-data-content-and-software-at-akvo/">why and how</a>.
                    </p>
                    </Container>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
