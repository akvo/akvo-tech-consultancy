import React, { Component } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    Container,
    Jumbotron,
} from 'react-bootstrap';
import Charts from '../components/Charts';
import axios from 'axios';

class Home extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Jumbotron className="charts">
                {this.props.value.active}
                    <Charts/>
                </Jumbotron>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
