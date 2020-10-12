import React, { Component } from 'react';
import ReactLoading from 'react-loading';

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'page-loading'}>
                <div className={'page-loading-text'}>
                    <h3>Loading Content</h3>
                </div>
                <ReactLoading className={'loading-animation'} type={'spin'} color={'#0072c6'} height={50} width={50} />
            </div>
        );
    }
}

export default Loading;
