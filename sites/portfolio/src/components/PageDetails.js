import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { Jumbotron, Image, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Slider from "react-slick";

class PageDetails extends Component {
    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {
        let data = this.props.value[this.props.value.page].find(p => p.active === true);
        let page = this.props.value.page;
        let thumb = data.galleries[0].replace(data.galleries[0].split("-").slice(-1), "");
        const settings = {
            customPaging: function(i) {
                return (
                    <button>
                        <img src={`${process.env.PUBLIC_URL}/images/${page}/${thumb}0${i + 1}.jpg`} alt={`${thumb}`}/>
                    </button>
                );
            },
            dots: true,
            dotsClass: "slick-dots slick-thumb",
            infinite: true,
            speed: 500,
            thumbnails: true,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        return (
            <Jumbotron>
                <h1 className="title-page">{data.title}</h1>
                <Slider {...settings}>{galleries(data.galleries, this.props.value.page)}</Slider>
                <div className="content">
                    <hr />
                    <h3>About the Project</h3>
                    <b>Objective</b>: <i>{data.objective}</i>
                    <br />
                    {pharagraph(data.description)}
                    <hr />
                    <h3>Project Details</h3>
                    <Table>
                        <tbody>
                            <tr>
                                <td>
                                    <b>Project Name</b>:
                                </td>
                                <td className="text-left">{data.project}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Countries</b>:
                                </td>
                                <td className="text-left">{data.countries}</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Partners</b>:
                                </td>
                                <td className="text-left">{data.partners}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <hr />
                <div className="footer">{data.link ? links(data.link) : ""}</div>
            </Jumbotron>
        );
    }
}

const links = link => {
    return (
        <a className="btn btn-primary btn-large btn-website" href={link} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={["fas", "globe"]} /> <span style={{ marginLeft: "5px" }}>Visit Website</span>
        </a>
    );
};

const renderText = text => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let parts = text.split(urlRegex);
    for (let i = 1; i < parts.length; i += 2) {
        parts[i] = (
            <a key={"link" + i} href={parts[i]} target="_blank" rel="noopener noreferrer">
                {parts[i]}
            </a>
        );
    }
    return parts;
};

const pharagraph = desc => {
    return desc.map((d, i) => {
        return <p key={"desc-" + i}> {renderText(d)} </p>;
    });
};

const galleries = (gal, page) => {
    return gal.map((g, i) => {
        return (
            <div key={i}>
                <Image src={`${process.env.PUBLIC_URL}/images/${page}/${g}`} fluid />
            </div>
        );
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(PageDetails);
