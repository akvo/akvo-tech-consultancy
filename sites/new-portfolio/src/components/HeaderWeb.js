import React from 'react'
import { Layout, Menu, Row, Col } from "antd";

const { Header } = Layout;

export const HeaderWeb = ({ ...props }) => {
    const { currentAnchor } = props;

    return (
        <Header>
          <div>
            <img src="/logo.svg" className="App-logo" alt="logo" />
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["section1"]}
            selectedKeys={[currentAnchor]}
          >
            <Menu.Item key="section1">
              <a href="#section1">Section 1</a>
            </Menu.Item>
            <Menu.Item key="section2">
              <a href="#section2">Section 2</a>
            </Menu.Item>
            <Menu.Item key="section3">
              <a href="#section3">Section 3</a>
            </Menu.Item>
            <Menu.Item key="section4">
              <a href="#section4">Section 4</a>
            </Menu.Item>
            <Menu.Item key="section5">
              <a href="#section5">Section 5</a>
            </Menu.Item>
            <Menu.Item key="section6">
              <a href="#section6">Section 6</a>
            </Menu.Item>
          </Menu>
        </Header>
    );
}