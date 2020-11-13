import React, { Component } from 'react';
import { RedocStandalone } from 'redoc';

class Documentation extends Component {
    render() {
        return (
            <RedocStandalone
                specUrl="/docs/api-docs.json"
                options= {{
                    nativeScrollbars: true,
                    hideLoading: true,
                    scrollYOffset: 50,
                    theme: {
                        colors: {
                            primary: {
                                main: '#3490dc'
                            }
                        }
                    }
                }}
            />
        );
    }
}

export default Documentation;
