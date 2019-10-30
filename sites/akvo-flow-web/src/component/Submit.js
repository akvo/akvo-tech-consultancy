import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import swal from '@sweetalert/with-react'
import ReCAPTCHA from "react-google-recaptcha"
import axios from 'axios'
import { Spinner } from 'reactstrap'
import '../App.css'
import { PROD_URL } from '../util/Environment'

const API_URL = (PROD_URL ? "https://2scale.tc.akvotest.org/akvo-flow-web-api/" : process.env.REACT_APP_API_URL)
const SITE_KEY = "6Lejm74UAAAAAA6HkQwn6rkZ7mxGwIjOx_vgNzWC"

class Submit extends Component {

    constructor(props) {
        super(props);
        this.showCaptcha = this.showCaptcha.bind(this)
        this.showPassword = this.showPassword.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.handleCaptcha = this.handleCaptcha.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.showSpinner = this.showSpinner.bind(this)
        this.state = {
            _showCaptcha : this.props.value.captcha,
            _showSpinner : false
        }
		this._reCaptchaRef = React.createRef();
    }

    handlePassword (event) {
        console.log(event.target.value)
        localStorage.setItem("_password",event.target.value)
    }

	handleCaptcha = value => {
		this.setState({captcha: value});
        this.props.submitState(true);
		if (this.state.captcha === null) this.setState({ expired: true });
	};

    asyncScriptOnLoad = () => {
        this.setState({ callback: "called!" });
    };

    showCaptcha = () => {
        return (
            <ReCAPTCHA
                style={{
                    'display': 'block',
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
        )
    }

    showPassword = () => {
        return (
            <Fragment>
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
            </Fragment>
        )
    }

    submitForm () {
        localStorage.setItem("_submissionStop", Date.now())
        this.setState({'_showSpinner': true})
        axios.post(API_URL+ 'submit-form', localStorage)
            .then(res => {
                this.setState({'_showSpinner': false})
                swal("Success!", "New datapoint is sent!", "success")
                return res;
            }).catch((res, error) => {
                console.log(res, error)
                this.setState({'_showSpinner': false})
                swal("Failed!", "Something Wrong!", "error")
                // setTimeout(function(){
                //     localStorage.clear()
                //     setTimeout(function(){
                //         window.location.reload();
                //     }, 5000);
                // }, 1000);
                // Debug swal("Oops!", "Something went wrong!", "error")
            })
    }

    showSpinner = value => {
        return (
            <Spinner size="sm" color="light" />
        )
    }

    render() {
        return (
            <Fragment>
                {this.props.value.captcha ? this.showCaptcha() : false}
                <div className="submit-block">
                    {this.props.value.submit? this.showPassword() : false}
                    <button
                        onClick={this.submitForm}
                        className={"btn btn-block btn-" + ( this.props.value.submit ? "primary" : "secondary")
                        }
                        disabled={this.props.value.submit ? false : true}
                    >
                    { this.state._showSpinner ? <Spinner size="sm" color="light" /> : "" }
                    <span>Submit</span>
                    </button>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Submit);