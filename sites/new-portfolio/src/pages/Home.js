import React, { useEffect } from 'react'
import { Layout, Row, Col, Image } from "antd";
import { Link } from "react-router-dom";
import { homeContent } from "../contents";

const { Content } = Layout; 

export const Home = (props) => {
    const { value, onLoad } = props;

    useEffect(() => {
        onLoad({...value, page:{title: 'Home', location:'/home', header: 'dark'}});
    }, []);

    const renderCards = () => {
        return homeContent.map((x, i) => {
            let orderLeft = (x.icon_position === 'left') ? 1 : 2;
            let orderRight = (x.icon_position === 'right') ? 1 : 2;
            return ( 
                <Row 
                    key={i} 
                    bordered={false.toString()} 
                    className="solution-card" 
                    justify="center" 
                    align="middle"
                    gutter={[40, 16]}
                >
                    <Col align={x.icon_position} md={3} order={orderLeft} className="gutter-row">
                        <Image height="12rem" src={x.icon} style={{transform: x.transform}}/>
                    </Col>
                    <Col align="left" md={14} order={orderRight} className="solution-card-content gutter-row">
                        <div className="title">{x.title}</div>
                        <div className="description">{x.description}</div>
                        <a href={x.link}>
                            <button className="btn-find-more">
                                Find out more
                            </button>
                        </a>
                    </Col>
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
