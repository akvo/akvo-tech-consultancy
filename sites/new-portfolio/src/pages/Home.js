import React from 'react'
import { Layout, Row, Col } from "antd";

const { Content } = Layout; 

export const Home = () => {
    console.log('Home');
    return (
        <Content>
            <Row>
                <Col span={24}>
                    <div className="App-sections">
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
                                <button className="btn-discover">
                                    Discover Akvo’s custom solutions
                                </button>
                            </div>
                        </div>

                        <div className="solution-container">
                            <h1>Akvo’s custom solutions</h1>
                        </div>
                    </div>
                </Col>
            </Row>
        </Content>
    )
}
