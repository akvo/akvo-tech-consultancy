import React, { Component } from 'react';

class Error extends Component {
    render() {
        return (
            <div className={this.props.styles}>
                 <h3 className="mt-2">
                   Form is not found
                </h3>
                <hr/>
                <p className="text-center">
                    Please check your <strong>Akvo Flow Instance</strong> or contact admin who manage the survey.
                </p>
            </div>
        );
    }
}

export default Error;
