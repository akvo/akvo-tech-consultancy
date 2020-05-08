import React, { Component } from 'react'
import {connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'

class Header extends Component {

    constructor(props) {
        super(props);
        this.renderLangOption = this.renderLangOption.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(data) {
        this.props.changeLang(data.target.value);
    }

    renderLangOption() {
        let langprop = this.props.value.lang;
        return langprop.list.map((x,i) => (
            <div key={'lang-' + i + '-' + x.id} className="form-check localization">
                <input
                    className="form-check-input"
                    type="radio"
                    name={"lang"}
                    value={x.id}
                    onChange={this.handleChange}
                    checked={x.id === langprop.active ? "selected" : ""}
                />
                <label
                    className="form-check-label"
                    htmlFor={"lang"}>
                    {x.name}
                </label>
            </div>
            )
        );
    }
    render() {
        return (
            <div className='sidebar-heading'>
                <div className="mt-2">
                <Toast>
                  <ToastHeader>
                    {this.props.value.surveyName}
                  </ToastHeader>
                  <ToastBody>
                    Survey ID: {this.props.value.surveyId}
                    <br/>
                    Version: {this.props.value.version}
                  </ToastBody>
                  <ToastHeader>
                    Localization:
                  </ToastHeader>
                  <ToastBody>
                    {this.renderLangOption()}
                  </ToastBody>
                </Toast>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
