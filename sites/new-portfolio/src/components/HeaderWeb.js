import React from 'react'
import { Layout, Menu, Row, Col } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

export const HeaderWeb = ({ ...props }) => {
  const { value } = props;
  const { page } = value;

  const headerClassName = page.header;
  const subtitleClassName = 'subtitle ' + page.header;
  const github = (page.header === 'dark') ? '/icons/ic-github.svg' : '/icons/ic-github-black.svg';
  const mail = (page.header === 'dark') ? '/icons/ic-mail.svg' : '/icons/ic-mail-black.svg';

  const renderMenu = () => {
    return (
      <Menu
        theme={page.header}
        mode="horizontal"
      >
        <Menu.Item key="1">
          <Link to="/data-portal">Monitoring & evaluation data portals</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="#">Remote data collection</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="#">Custom reports</Link>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <Header className={headerClassName}>
      <Row justify="center" align="middle">
        <Col span={4}>
          <div style={{textAlign:"center"}}>
            <Link to="/">
              <img src="/akvo.svg" className="App-logo" alt="logo" />
            </Link>
            <div className={subtitleClassName}>Custom solutions</div>
          </div>
        </Col>
        <Col span={17}>
          { (page.location !== 'home') && renderMenu() }
        </Col>
        <Col span={3}>
          <div style={{float:'right'}}>
            <img src={github} width="27" alt="akvo-github" />
            <img src={mail} width="27" alt="akvo-mail" style={{marginLeft:"0.8rem"}} />
          </div>
        </Col>
      </Row>
    </Header>
  );
}