import React, { Component, Fragment } from 'react';
import { Container, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import DataFilters from '../components/DataFilters';

class PageWebform extends Component {
    render() {
        let filters = this.props.value.filters['overviews'];
        let url = "https://tech-consultancy.akvotest.org/akvo-flow-web/westafrica/" + filters.source;

        return (
            <Fragment>
                <Container className="top-container">
                    <DataFilters className='dropdown-left'/>
                    {/* <div className="right-listgroup"></div> */}
                </Container>
                <Container className="container-content container-iframe">
                    { (filters.source !== null) ?
                        <iframe
                            src={url}
                            width="100%"
                            frameBorder="0"
                        >
                        </iframe> : 
                        <p className="text-center align-middle text-muted ">
                            Please select a source.
                        </p>
                    }
                </Container>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageWebform);