import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import ReCAPTCHA from "react-google-recaptcha"
import axios from 'axios'
import { Spinner } from 'reactstrap'
import '../App.css'
import { PopupSuccess, PopupError, PopupToast } from '../util/Popup'
import { API_URL, CAPTCHA_KEY , PARENT_URL, USING_PASSWORDS} from '../util/Environment'
import JSZip from 'jszip'
import Dexie from 'dexie';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import dataURItoBlob from 'datauritoblob';

const survey_form = window.location.pathname.split('/');
const passvar = survey_form.includes(USING_PASSWORDS) ? "_password" : "_default_password";

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
            _saveButton : true
        }
        this._reCaptchaRef = React.createRef();
    }

    handlePassword (event) {
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

    saveResult(newId) {
        PopupSuccess("New datapoint saved! clearing form...");
        this.props.urlState(true);
        localStorage.setItem('_cache', newId);
        let url = PARENT_URL ? document.referrer : window.location.href;
        this.props.updateDomain(url + '/' + newId);
    }

    saveData(content) {
        const files = JSON.parse(localStorage.getItem('__files__') || '{}');
        const fileIds = Object.keys(files);
        const db = new Dexie('akvoflow');
        db.version(1).stores({ files: 'id' });
        db.files.bulkGet(fileIds)
            .then((result) => {
                let postData;
                if (result.length === 0) {
                    postData = content;
                }
                else {
                    postData = Object.assign({}, content, { __files__: result });
                }
                if (localStorage.getItem('_cache') !== null) {
                    axios.put(API_URL + 'form-instance/' + localStorage.getItem('_cache'),
                        postData, { headers: { 'Content-Type': 'application/json' } })
                        .then(res => {
                            PopupToast("Datapoint Updated!", "success");
                            this.setState({_saveButton: true});
                        })
                        .catch(e => {
                            console.error(e);
                            PopupError("Something went wrong");
                            this.setState({_saveButton: true});
                        })
                }
                else {
                    axios.post(API_URL + 'form-instance',
                        postData, { headers: { 'Content-Type': 'application/json' } })
                        .then(res => {
                            this.saveResult(res.data.id);
                            this.setState({_saveButton: true});
                        })
                        .catch(e => {
                            console.error(e);
                            PopupError("Something went wrong");
                            this.setState({_saveButton: true});
                        })
                    }

            })
            .catch(e => {
                console.error(e);
                PopupError("Something went wrong");
            })
    }

    sendData(content) {
        const cacheId = this.props.cacheId ? '/' + this.props.cacheId : this.props.cacheId;
        const uppy = Uppy({ debug: true })
            .use(AwsS3, {
                getUploadParameters: function (file) {
                    const folder = file.type === 'application/zip' ? 'devicezip' : 'images';
                    return {
                        method: 'POST',
                        url: file.postUrl,
                        fields: Object.assign({
                            key: folder + '/' + file.name,
                            'content-type': file.type
                        }, file.policy)
                    }
                }
            });

        axios.post(API_URL + 'upload-data',
            content, { headers: { 'Content-Type': 'application/json' } }
        )
            .then(res => {
                const zip = new JSZip();
                const formInstance = res.data.data;

                zip.file('data.json', JSON.stringify(formInstance));

                zip.generateAsync({ type: 'blob' })
                    .then(blob => {

                        uppy.addFile({
                            name: res.data.data.uuid + '.zip',
                            type: 'application/zip',
                            data: blob,
                            source: 'Local',
                            isRemote: false
                        });

                        const files = JSON.parse(localStorage.getItem('__files__') || '{}');
                        const fileIds = Object.keys(files);
                        const db = new Dexie('akvoflow');
                        db.version(1).stores({ files: 'id' });
                        db.files.bulkGet(fileIds)
                            .then((result) => {

                                result.forEach((f) => {
                                    const mimeType = f.blob.split(',')[0].split(':')[1].split(';')[0];
                                    uppy.addFile({
                                        name: f.id,
                                        type: mimeType,
                                        data: dataURItoBlob(f.blob),
                                        source: 'Local',
                                        isRemote: false
                                    });
                                });

                                let zipFileName;

                                uppy.getFiles().forEach((f) => {
                                    f.postUrl = 'https://' + this.props.value.instanceId + '.s3.amazonaws.com';
                                    if (f.type.indexOf('image/') !== -1) {
                                        f.policy = res.data.policy.image;
                                    } else {
                                        zipFileName = f.name;
                                        f.policy = res.data.policy.zip;
                                    }
                                });

                                uppy.upload().then((result) => {

                                    console.info('Successful uploads:', result.successful)
                                    if (result.failed.length > 0) {
                                        console.error('Errors:')
                                        result.failed.forEach((file) => {
                                            console.error(file.error)
                                        })
                                    }

                                    axios.get('https://' + this.props.value.instanceName + '.akvoflow.org/processor', {
                                        params: {
                                            action: 'submit',
                                            formID: formInstance.formId,
                                            fileName: zipFileName,
                                            devId: formInstance.devId
                                        }
                                    })
                                        .then(res => {
                                            PopupSuccess("New datapoint is sent! clearing form...");
                                            this.setState({ '_showSpinner': false })
                                            setTimeout(function () {
                                                db.delete()
                                                let username = localStorage.getItem('_username');
                                                localStorage.clear();
                                                localStorage.setItem('_username', username);
                                                setTimeout(function () {
                                                    let redirect_url = window.location.origin + window.location.pathname;
                                                    if (cacheId) {
                                                        redirect_url = redirect_url.replace(cacheId, '')
                                                    }
                                                    window.location.replace(redirect_url);
                                                }, 3000);
                                            }, 500);
                                        })
                                        .catch(e => {
                                            console.error(e);
                                            PopupError("Something went wrong");
                                            this.setState({ '_showSpinner': false })
                                        })
                                });

                            })
                            .catch((e) => {
                                console.error(e);
                            })
                    })
                    .catch(e => {
                        console.error(e);
                    });
                return res;
            }).catch((e) => {
                PopupError(e.response.data.message);
                this.setState({ '_showSpinner': false })
            })
    }

    submitForm (e) {
        e.stopPropagation();
        localStorage.setItem("_submissionStop", Date.now())
        this.setState({'_showSpinner': true})
        let dpname = localStorage.getItem('_dataPointName');
        if (!dpname) {
            localStorage.setItem('_dataPointName','Untitled');
        }
        this.sendData(localStorage);
        return false;
    }

    saveForm (e) {
        e.stopPropagation();
        let dpname = localStorage.getItem('_dataPointName');
        if (!dpname) {
            localStorage.setItem('_dataPointName','Untitled');
        }
        this.setState({_saveButton: false});
        this.saveData(localStorage);
    }

    render() {
        const hasSaveButton = survey_form.includes(USING_PASSWORDS) ? true : false;
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
                    sitekey={CAPTCHA_KEY}
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
                    { hasSaveButton ? (
                        <button
                            onClick={e => this.saveForm(e)}
                            className={"btn btn-block btn-primary"}
                            disabled={this.state._saveButton ? false : true}>
                            Save
                        </button>
                    ) : ""}
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
