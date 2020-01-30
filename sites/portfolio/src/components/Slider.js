import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';

const images = [ 'slider-01.jpg', 'slider-02.jpg'];

class Slider extends Component {

    constructor(props) {
        super(props);
    }

    sliders = (images) => {
        return images.map((s, i) => (
              <Carousel.Item key={i}>
                <img
                  className="d-block w-100"
                  src={ `${process.env.PUBLIC_URL}/images/${s}` }
                  alt={"slide" + i}
                />
              </Carousel.Item>
        ))
    }

    render() {
        return (
            <Carousel className="carousel">
                {this.sliders(images)}
            </Carousel>
        )
    }
}

export default Slider;
