import React, { Component } from 'react'
import {connect } from 'react-redux';
import { mapStateToProps } from '../reducers/actions.js'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'

class Header extends Component {
    render() {
        return (
            <div className='sidebar-heading'>
                <div className="my-2">
                <Toast>
                  <ToastHeader>
                      <img alt="img-logo" src="https://www.2scale.org/assets/default/img/logo_2scale_red.gif" className='responsive-image'/>
                    {this.props.value.surveyName}
                  </ToastHeader>
                  <ToastBody>
                    Survey ID: {this.props.value.surveyId}
                    <br/>
                    Version: {this.props.value.version}
                  </ToastBody>
                </Toast>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Header);
