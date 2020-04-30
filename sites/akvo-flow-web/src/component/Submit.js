import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import swal from '@sweetalert/with-react'
import ReCAPTCHA from "react-google-recaptcha"
import axios from 'axios'
import { Spinner } from 'reactstrap'
import '../App.css'
import { PROD_URL, USING_PASSWORDS } from '../util/Environment'

const API_ORIGIN = (PROD_URL ? ( window.location.origin + "/" + window.location.pathname.split('/')[1] + "-api/" ) : process.env.REACT_APP_API_URL);
const SITE_KEY = "6Lejm74UAAAAAA6HkQwn6rkZ7mxGwIjOx_vgNzWC"

class Submit extends Component {

    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleCaptcha = this.handleCaptcha.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.handleUser = this.handleUser.bind(this)
        this.state = {
            _showCaptcha : this.props.value.captcha,
            _showSpinner : false,
        }
		this._reCaptchaRef = React.createRef();
    }

    handlePassword (event) {
        let survey_form = window.location.pathname.split('/');
        const passvar = survey_form.includes(USING_PASSWORDS) ? "_password" : "_default_password";
        localStorage.setItem(passvar,event.target.value)
    }

    handleUser (event) {
        this.setState({'_submitDisabled':false});
        localStorage.setItem("_username", event.target.value);
        if (event.target.value === "") {
            this.setState({'_submitDisabled':true});
            localStorage.removeItem("_username");
        }
    }

	handleCaptcha = value => {
        this.setState({captcha: value});
        this.props.submitState(true);
        if (localStorage.getItem('_username')) {
            this.setState({'_submitDisabled': false});
        }
        if (this.state.captcha === null) {
            this.setState({ expired: true });
        }
	};

    asyncScriptOnLoad = () => {
        this.setState({ callback: "called!" });
    };

    sendData(content) {
        axios.post(API_ORIGIN+ 'submit-form',
                content, { headers: { 'Content-Type': 'application/json' } }
            )
            .then(res => {
                swal({
                    icon: "success",
                    title: "Success!",
                    text: "New datapoint is sent! clearing form...",
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    button: false,
                    timer: 3200
                })
                this.setState({'_showSpinner': false})
                setTimeout(function(){
                    let username = localStorage.getItem('_username');
                    localStorage.clear();
                    localStorage.setItem('_username', username);
                    setTimeout(function(){
                        window.location.replace(window.location.origin + window.location.pathname);
                     }, 3000);
                }, 500);
                return res;
            }).catch((res, error) => {
                console.log(res, error)
                this.setState({'_showSpinner': false})
                swal("Oops!", "Something went wrong!", "error")
            })
    }

    submitForm (e) {
        e.stopPropagation();
        localStorage.setItem("_submissionStop", Date.now())
        this.setState({'_showSpinner': true})
        let dpname = localStorage.getItem('_dataPointName');
        if (!dpname) {
            localStorage.setItem('_dataPointName','Untitled');
            this.sendData(localStorage);
        }
        this.sendData(localStorage);
        return true;
    }

    render() {
        return (
            <Fragment>
                <ReCAPTCHA
                    style={{
                        'display': this.props.value.captcha ? 'block' : 'none',
                        'overflow': 'hidden',
                        'borderBottom': '1px solid #ddd',
                        'padding': '8px',
                    }}
                    size="normal"
                    theme="light"
                    ref={this._reCaptchaRef}
                    sitekey={SITE_KEY}
                    onChange={this.handleCaptcha}
                    asyncScriptOnLoad={this.asyncScriptOnLoad}
                />
                <div className="submit-block">
                    <div style={{ 'display': this.props.value.submit ? 'block' : 'none' }} >
                        <label
                            className="form-password-label"
                            htmlFor={"submit-username"}>
                            Submitter
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            name="submit-username"
                            onChange={this.handleUser}
                        />
                        <label
                            className="form-password-label"
                            htmlFor={"submit-password"}>
                            Password:
                        </label>
                        <input
                            className="form-control"
                            type="password"
                            name="submit-password"
                            onChange={this.handlePassword}
                        />
                        <hr/>
                    </div>
                    <button
                        onClick={e => this.submitForm(e)}
                        className={"btn btn-block btn-" + ( this.props.value.submit ? "primary" : "secondary")}
                        disabled={this.props.value.submit ? false : true}
                    >
                        { this.state._showSpinner ? <Spinner size="sm" color="light" /> : "" }
                        Submit
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Submit);
