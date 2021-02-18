import React from 'react'
import { Layout, Menu, Row, Col } from "antd";

const { Header } = Layout;

export const HeaderWeb = ({ ...props }) => {
  const { value } = props;
  const { page } = value;

  const headerClassName= "App-logo " + page.header;

  const renderMenu = () => {
    return (
      <Menu
        theme={page.header}
        mode="horizontal"
      >
        <Menu.Item key="section1">
          <a href="#section1">Section 1</a>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <Header className={headerClassName}>
      <Row justify="center" align="middle">
        <Col span={4}>
          <div style={{textAlign:"center"}}>
            <img src="/akvo.svg" className="App-logo" alt="logo" />
            <div className="subtitle">Custom solutions</div>
          </div>
        </Col>
        <Col span={17}>
          { (page.location !== 'home') && renderMenu() }
        </Col>
        <Col span={3}>
          <div style={{float:'right'}}>
            <img src="/icons/ic-github.svg" width="27" alt="akvo-github" />
            <img src="/icons/ic-mail.svg" width="27" alt="akvo-mail" style={{marginLeft:"0.8rem"}} />
          </div>
        </Col>
      </Row>
    </Header>
  );
}