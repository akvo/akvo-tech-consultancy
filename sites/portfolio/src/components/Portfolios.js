import React, { Component } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Portfolios extends Component {

    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this)
    }

    description = (desc) => {
        return desc.map((d, i) => {
            if (i === 0) {
                let limit = d.substring(0, 75) + "...";
                return (<Card.Text key={ i }>{ limit }</Card.Text>);
            }
            return false;
        })
    }

    changePage (e) {
        let id = parseInt(e.target.value);
        this.props.hidePage(true);
        this.props.showPortfolio(id);
    }

    render() {
        return this.props.value.portfolios.map((data, index) => {
            return (
                <Col style={{marginBottom: 1 + "rem"}} xs={4} key={index}>
                    <Card>
                        <Card.Header>{ data.title }</Card.Header>
                        <Card.Img variant="top" src={"images/portfolio/" + data.galleries[0]} />
                        <Card.Body>
                            { this.description(data.description) }
                            <div className="text-center">
                            <Button
                                variant="primary"
                                className="btn-card"
                                value={data.id}
                                onClick={this.changePage}
                            >
                                <FontAwesomeIcon icon={["fas", "info-circle"]} /> Read More
                            </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            )
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolios);
