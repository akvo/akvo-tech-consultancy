import React, { Component, Fragment } from 'react';

class Documentation extends Component {
    
    constructor(props) {
        super(props);    
    };

    render() {
        return (
            <Fragment>
                <iframe 
                    src={"/files/IDH Farmfit Primary Data Collection Methodology (version 20-02-10).pdf"}
                    style={{overflow:"hidden !important"}}
                    frameBorder={0}
                    width={"100%"}
                    height={"916px"}
                >
                </iframe>
            </Fragment>
        );
    };
}

export default Documentation;