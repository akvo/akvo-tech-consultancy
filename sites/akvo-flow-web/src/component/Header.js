import React, { Component, Fragment } from 'react'
import {connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import { Toast, ToastHeader, ToastBody } from 'reactstrap'
import { CopyToClipboard } from '../util/Utilities.js'
import { PopupToast } from '../util/Popup'
import { SAVE_FEATURES} from '../util/Environment'

/*
const BadgeCircle = ({kind}) =>
    (<span className={"badge badge-" + kind + " badge-circle"}></span>);
*/

class Header extends Component {

    constructor(props) {
        super(props);
        this.renderLangOption = this.renderLangOption.bind(this);
        this.renderHeaderInfo = this.renderHeaderInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.copyUrl = this.copyUrl.bind(this);
        this.getExtraHeader = this.getExtraHeader.bind(this);
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
        return langprop.list.map((x,i) => {
            return (
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
        })
    }

    renderHeaderInfo(info) {
        return info.map((x, i) => (
            <div key={i}> {x} </div>
        ));
    }

    getExtraHeader() {
        let instance = SAVE_FEATURES.find(x => x.instance === this.props.value.instanceName);
        if (instance) {
            if (!instance.formEndpoint) {
                return "";
            }
        }
        return (
            <Fragment>
              <ToastHeader>
                  Saved Links:
              </ToastHeader>
              <ToastBody>
                  <pre>{this.props.value.domain}</pre>
                  <button
                      className="btn btn-repeatable btn-warning"
                      onClick={e => this.copyUrl()}
                  >
                      Copy URL to Clipboard
                  </button>
              </ToastBody>
            </Fragment>
        )
    }

    copyUrl() {
        CopyToClipboard(this.props.value.domain)
        PopupToast("Copied to Clipboard!", "info");
    }

    render() {
        let totalquestion = this.props.value.groups.list.reduce((i, t) => {
            if (i === 0) {
                return t.attributes.questions;
            }
            return i + t.attributes.questions;
        }, 0);
        let info = [
            "Question Groups: " + this.props.value.groups.list.length,
            "Questions: " + totalquestion,
        ];
        let name = this.props.value.instanceName.toUpperCase() + " - ";
            name += this.props.value.surveyName;
            name += " v" + this.props.value.version;
            name += " - " + this.props.value.surveyId;
        let customPartner = SAVE_FEATURES.map(x => x.instance);
            customPartner = customPartner.includes(this.props.value.instanceName);
        let user = customPartner ? this.props.value.user : false;
        return (
            <div className='sidebar-heading'>
                <div>
                <Toast>
                    <ToastHeader>
                    { user ? (
                        <>
                            <div className="info-survey-name">
                            {this.props.value.surveyName}
                            </div>
                            <div className="badge badge-secondary badge-user">
                            {this.props.value.user}
                            </div>
                        </>
                    ) : name }
                    </ToastHeader>
                  <ToastBody>
                      {this.renderHeaderInfo(info)}
                  </ToastBody>
                      {this.props.value.savedUrl ? this.getExtraHeader() : ""}
                  <ToastHeader></ToastHeader>
                  <ToastHeader>
                      Localization
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
