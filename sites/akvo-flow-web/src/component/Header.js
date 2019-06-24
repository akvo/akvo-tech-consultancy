import React, { Component } from 'react'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'

class Header extends Component {
    render() {
        return (
            <div className='sidebar-heading'>
                <div className="my-2">
                <Toast>
                  <ToastHeader>
                    {this.props.data.name}
                  </ToastHeader>
                  <ToastBody>
                    Survey ID: {this.props.data.surveyId}
                    <br/>
                    Version: {this.props.data.version}
                  </ToastBody>
                </Toast>
                </div>
            </div>
        )
    }
}

export default Header;
