import React, { useEffect } from 'react';
import { Layout, Row, Col, Carousel, Image } from "antd";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { dataPortalContent } from "../contents";

const { Content } = Layout;

const SampleNextArrow = props => {
    const { className, style, onClick } = props;
    console.log(props);
    return (
        <div
            className={className}
            style={{
            ...style,
            color: "#707070",
            fontSize: '15px',
            lineHeight: '1.5715'
            }}
            onClick={onClick}
        >
            <RightOutlined />
        </div>
    )
  }

const SamplePrevArrow = props => {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{
                ...style,
                color: "#707070",
                fontSize: '15px',
                lineHeight: '1.5715'
            }}
            onClick={onClick}
        >
            <LeftOutlined />
        </div>
    )
}

const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
}

export const DataPortal = (props) => {
    const { value, onLoad } = props;

    useEffect(() => {
        onLoad({...value, page:{location:'/data-portal', header: 'light'}});
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
                    <Row justify="center" align="middle">
                        <Col span={4} align="center"></Col>
                        <Col span={16} align="center">
                            <Carousel autoplay arrows {...settings}>
                                {x.images.map((y, z) => {
                                    let source = "/images/" + y;
                                    return (
                                        <Image key={z} className="image-carousel" src={source} />
                                    );
                                })}
                            </Carousel>
                        </Col>
                        <Col span={4} align="center"></Col>
                    </Row>
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