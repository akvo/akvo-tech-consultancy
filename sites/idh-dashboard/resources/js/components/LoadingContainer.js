import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import ReactLoading from 'react-loading';

class LoadingContainer extends Component {

    render() {
        return (
            <>
            <Row className="text-center">
                <div className="loading-text">
                    <b>Loading Content</b>
                </div>
            </Row>
            <Row className="text-center">
                <div className="loading-spinner">
                <ReactLoading
                    className={'loading-animation'}
                    type={'spin'}
                    color={'#0072c6'}
                    height={50} width={50} />
                </div>
            </Row>
            </>
        );
    }
}

export default LoadingContainer;
