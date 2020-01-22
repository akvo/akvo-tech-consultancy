import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { Container, Row, Button } from 'react-bootstrap';
import Navigation from './Navigation';
import Portfolios from './Portfolios';
import Portfolio from './Portfolio';
import Slider from './Slider';
import axios from 'axios';

class Page extends Component {

    constructor(props) {
        super(props);
        this.setPage = this.setPage.bind(this)
    }

    componentDidMount() {
        axios.get('./data/portfolio.json')
            .then(res => {
                this.props.getPortfolio(res.data);
            });
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
                    <Portfolios />
                </Row>
            </Container>
            </Fragment>
        )
    }

    showPortfolio () {
        return (
            <Container style={{marginTop: 30 +"px"}}>
                <Row>
                    <Portfolio />
                </Row>
            </Container>
        )
    }

    render() {
        return (
            <Fragment>
                <Navigation/>
                { this.props.value.page ? this.setPage('main') : this.showPortfolio() }
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
