import React, { Component } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { Col, Card, Button } from 'react-bootstrap';

class Portfolio extends Component {

    constructor(props) {
        super(props);
    }

    description = (desc) => {
        return desc.map((d, i) => {
            if (i === 0) {
                let limit = d.substring(0, 120) + "...";
                return (<Card.Text key={ i }>{ limit }</Card.Text>);
            }
            return false;
        })
    }

    render() {
        console.log(this.props.value.portfolios);
        return this.props.value.portfolios.map((data, index) => {
            return (
                <Col xs={4} key={index}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={"images/" + data.galleries[0]} />
                        <Card.Body>
                            <Card.Title>{ data.title }</Card.Title>
                            { this.description(data.description) }
                            <Button variant="primary" className="btn-block">
                                Read More
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            )
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
