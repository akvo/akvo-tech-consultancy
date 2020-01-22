import React, { Component } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions'
import { Jumbotron, Image, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Slider from "react-slick";

class Portfolio extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
      window.scrollTo(0, 0)
    }

    render() {
        let data = this.props.value.portfolio.find((p) => p.active === true);
        let thumb = data.galleries[0].replace(data.galleries[0].split("-").slice(-1), "");
        const settings = {
            customPaging: function(i) {
                return (
                  <a>
                      <img src={`${process.env.PUBLIC_URL}/images/portfolio/${thumb}0${i + 1}.jpg`} />
                    </a>
                );
            },
            dots: true,
            dotsClass: "slick-dots slick-thumb",
            infinite: true,
            speed: 500,
            thumbnails: true,
            slidesToShow: 1,
            slidesToScroll: 1
        }
        console.log(thumb);
        return (
            <Jumbotron>
              <h1 className="title-page">{data.title}</h1>
                <Slider {...settings}>
                    {galleries(data.galleries)}
                </Slider>
              <div className="content">
                  <hr/>
                  <h3>About the Project</h3>
                  <b>Objective</b>: <i>{data.objective}</i><br/>
					{pharagraph(data.description)}
                  <hr/>
                  <h3>Project Details</h3>
				  <Table>
                      <tbody>
                          <tr>
                              <td><b>Project Name</b>: </td>
                              <td className="text-left">{data.project}</td>
                          </tr>
                          <tr>
                              <td><b>Countries</b>: </td>
                              <td className="text-left">{data.countries}</td>
                          </tr>
                          <tr>
                              <td><b>Partners</b>: </td>
                              <td className="text-left">{data.partners}</td>
                          </tr>
                      </tbody>
                  </Table>
              </div>
              <hr/>
              <div className="footer">
                { data.link ? links(data.link) : "" }
              </div>
            </Jumbotron>
        )
    }

}

const links = (link) => {
    return (
        <a className="btn btn-primary btn-large btn-website" href={link} target="_blank">
            <FontAwesomeIcon icon={["fas","globe"]} /> <span style={{marginLeft:"5px"}}>Visit Website</span>
        </a>
    )
}

const pharagraph = (desc) => {
    return desc.map((d, i) => {
        return(
            <p key={"desc-" + i}> {d} </p>
        );
    });
}

const galleries = (gal) => {
    return gal.map((g, i) => {
        return(
            <div key={i}>
                <Image src={`${process.env.PUBLIC_URL}/images/portfolio/${g}`} fluid />
            </div>
        );
    })
}


export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
