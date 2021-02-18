import React, { useEffect } from 'react'
import { Layout, Row, Col, Image } from "antd";
import { Link } from "react-router-dom";
import { homeContent } from "../contents";

const { Content } = Layout; 

export const Home = (props) => {
    const { value, onLoad } = props;

    useEffect(() => {
        onLoad({...value, page:{location:'home', header: 'dark'}});
    }, []);

    const renderCards = () => {
        return homeContent.map((x, i) => {
            return ( 
                <Row 
                    key={i} 
                    bordered={false} 
                    className="solution-card" 
                    justify="center" 
                    align="middle"
                    gutter={[40, 16]}
                >
                    { x.icon_position === 'left' && (
                        <Col className="gutter-row" span={3}>
                            <Image height={180} src={x.icon} />
                        </Col>
                    )}
                    <Col span={14} className="solution-card-content gutter-row" style={{textAlign:'left'}}>
                        <div className="title">{x.title}</div>
                        <div className="description">{x.description}</div>
                        <Link to={x.link}>
                            <button className="btn-find-more">
                                Find out more
                            </button>
                        </Link>
                    </Col>
                    { x.icon_position === 'right' && (
                        <Col className="gutter-row" span={3}>
                            <Image height={180} src={x.icon} />
                        </Col>
                    )}
                </Row>
            );
        });
    };

    return (
        <Content>
            <Row>
                <Col span={24}>
                    {/* <div className="App-sections"> */}
                    <div className="welcome-container">
                        <div className="welcome-text">
                            Finding the right technical solution for all of your data needs is a challenge. <br/>
                            Many development programmes use different systems for different aspects of their Data Journey, 
                            resulting in poor system adoption, messy data, and a loss of resources.
                        </div>
                        <div className="welcome-heading">
                            We customise our Data Platform to create comprehensive solutions for your programme’s data needs.
                        </div>
                        <div className="btn-discover-container">
                            <a href="#akvo-custom-solution">
                                <button className="btn-discover">
                                    Discover Akvo’s custom solutions
                                </button>
                            </a>
                        </div>
                    </div>
                    {/* </div> */}
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className="solution-container" id="akvo-custom-solution">
                        <h1>Akvo’s custom solutions</h1>
                        <div className="solution-cards-container">
                            { renderCards() }
                        </div>
                    </div>
                </Col>
            </Row>
        </Content>
    )
}
