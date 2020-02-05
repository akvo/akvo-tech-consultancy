import React, { Component } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BeatLoader } from "react-spinners";

class PageThumbs extends Component {

    constructor(props) {
        super(props);
        this.changePage = this.changePage.bind(this)
        this.spinnerImage = this.spinnerImage.bind(this)
        this.state = {}
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

    handleImageLoaded (img) {
        let image = img.target.id;
        this.setState({[image]: true });
    }

    changePage (e) {
        let id = parseInt(e.target.value);
        this.props.changePage(this.props.lists);
        console.log(this.props.lists);
        this.props.showSubPage(id, this.props.lists.toUpperCase());
    }

    spinnerImage (index) {
        return (
            <BeatLoader
                css="margin-top:90px"
                size={20}
                color={"#03ad8c"}
            />
        )
    }

    render() {
        return this.props.value[this.props.lists].map((data, index) => {
            return (
                <Col className='container-thumbnails' xs={4} key={index}>
                    <Card>
                        <Card.Header>{ data.title }</Card.Header>
                        <div className="thumbnails">
                        {this.state["pf_img_" + index] ? "" : this.spinnerImage(index)}
                        <Card.Img
                            id={`pf_img_${index}`}
                            variant="top"
                            src={`images/${this.props.lists}/${data.galleries[0]}`}
                            onLoad={this.handleImageLoaded.bind(this)}
                        />
                        </div>
                        <Card.Body>
                            { this.description(data.description) }
                        </Card.Body>
                        <Card.Footer className="thumbnails-footer">
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
                        </Card.Footer>
                    </Card>
                </Col>
            )
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageThumbs);
