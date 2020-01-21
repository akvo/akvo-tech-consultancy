import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { Container, Row } from 'react-bootstrap';
import Navigation from './Navigation';
import Portfolio from './Portfolio';
import Slider from './Slider';
import axios from 'axios';

class Page extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        axios.get('./data/portfolio.json')
            .then(res => {
                this.props.getPortfolio(res.data);
            });
    }

    render() {
        return (
            <Fragment>
            <Navigation/>
                <Slider/>
                <Container style={{marginTop: 30 +"px"}}>
                    <Row>
                        <Portfolio/>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page);
