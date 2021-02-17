import React from 'react'
import { Layout, Menu, Row, Col } from "antd";

const { Header } = Layout;

export const HeaderWeb = ({ ...props }) => {
    return (
        <Header>
          <div>
            <img src="/akvo.svg" className="App-logo" alt="logo" />
            <span className="subtitle">Custom solutions</span>
          </div>
          {/* <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2section1"]}
          >
            <Menu.Item key="section1">
              <a href="#section1">Section 1</a>
            </Menu.Item>
          </Menu> */}
        </Header>
    );
}