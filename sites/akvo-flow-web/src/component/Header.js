import React, { Component } from 'react'
import {connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'
import { CopyToClipboard } from '../util/Utilities.js'

class Header extends Component {

    constructor(props) {
        super(props);
        this.renderLangOption = this.renderLangOption.bind(this);
        this.renderHeaderInfo = this.renderHeaderInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.copyUrl = this.copyUrl.bind(this);
    }

    handleChange(data) {
        let value = data.target.value;
        let active = this.props.value.lang.active;
        let current = data.target.checked ? [...active, value] : active.filter(x => x !== value);
        current = current.length === 0 ? this.props.value.lang.active : current;
        this.props.changeLang(current);
    }

    renderLangOption() {
        let langprop = this.props.value.lang;
        return langprop.list.map((x,i) => (
            <div key={'lang-' + i + '-' + x.id} className="form-check localization">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name={"lang"}
                    value={x.id}
                    onChange={this.handleChange}
                    checked={langprop.active.includes(x.id) ? "selected" : ""}
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

    renderHeaderInfo(info) {
        return info.map((x, i) => (
            <div key={i}> {x} </div>
        ));
    }

    copyUrl() {
        CopyToClipboard(this.props.value.domain)
    }


    render() {
        let info = [
            "Survey ID: " + this.props.value.surveyId,
            "Version: " + this.props.value.version,
        ]
        return (
            <div className='sidebar-heading'>
                <div>
                <Toast>
                  <ToastHeader>
                      {this.props.value.surveyName}
                  </ToastHeader>
                  <ToastBody>
                      {this.renderHeaderInfo(info)}
                  </ToastBody>
                  <ToastHeader>
                      Saved Links:
                  </ToastHeader>
                  <ToastBody>
                      <button
                          className="btn btn-repeatable btn-warning"
                          onClick={e => this.copyUrl()}
                      >
                          Copy URL to Clipboard
                      </button>
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
