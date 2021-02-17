import React from 'react'
import { Layout } from "antd";

const { Footer } = Layout;

export const FooterWeb = () => {
    return (
        <Footer className="App-footer">
            <div className="App-footer-copyrights">
            @2020 Some rights reserved
            </div>
        </Footer>
    );
}
