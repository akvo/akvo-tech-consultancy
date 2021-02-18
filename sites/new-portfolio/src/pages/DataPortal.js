import React, { useEffect } from 'react';
import { Layout, Row, Col, Carousel } from "antd";
import { dataPortalContent } from "../contents";

const { Content } = Layout;

const contentStyle = {
    height: "35rem",
    color: '#fff',
    lineHeight: "35rem",
    textAlign: 'center',
    background: '#364d79',
  };

export const DataPortal = (props) => {
    const { value, onLoad } = props;

    useEffect(() => {
        onLoad({...value, page:{location:'data-portal', header: 'light'}});
    }, []);

    const renderContent = () => {
        return dataPortalContent.map((x,i) => {
            let pageContentClassName = "page-content dark";
            if ((i+1) % 2 === 0) {
                pageContentClassName = "page-content light";
            }
            return (
                <div className={pageContentClassName} key={i}>
                    <h3>{x.title}</h3>
                    <p>{x.description}</p>
                    <Carousel autoplay>
                        {x.images.map((y, z) => {
                            return (
                                <div>
                                    <h3 style={contentStyle}>{z}</h3>
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
            );
        });
    };

    return (
        <Content className="page-wrapper">
            <Row justify="center">
                <Col span={24}>
                    <div className="page-heading">
                        <h1 className="page-title">Monitoring & evaluation data portals</h1>
                        <h3 className="page-subtitle">Make use of an integrated M&E data portal that is tailored to your data needs.</h3>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className="page-body">
                        {renderContent()}
                    </div>
                </Col>
            </Row>
        </Content>
    );
}