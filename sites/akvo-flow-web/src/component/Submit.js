import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import ReCAPTCHA from "react-google-recaptcha"
import axios from 'axios'
import { Spinner } from 'reactstrap'
import '../App.css'
import { PopupSuccess, PopupError, PopupToast, PopupCustomConfirmation } from '../util/Popup'
import { API_URL, CAPTCHA_KEY , PARENT_URL, USING_PASSWORDS, SAVE_FEATURES} from '../util/Environment'
import JSZip from 'jszip'
import Dexie from 'dexie';
import Uppy from '@uppy/core';
import AwsS3 from '@uppy/aws-s3';
import dataURItoBlob from 'datauritoblob';
import qs from 'qs';

const survey_form = window.location.pathname.split('/');
const passvar = survey_form.includes(USING_PASSWORDS) ? "_password" : "_default_password";
const urlParams = qs.parse(document.location.search, {ignoreQueryPrefix: true});

class Submit extends Component {

    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleCaptcha = this.handleCaptcha.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
        this.handleUser = this.handleUser.bind(this)
        this.state = {
            _username: "",
            _skipPassword: false,
            _skipMandatories: false,
            _hasSaveButton: false,
            _showSpinner : false,
            _saveButton : true
        }
        this._reCaptchaRef = React.createRef();

        /* CUSTOM */
        this.pushApi = this.pushApi.bind(this);
        /* END CUSTOM */
    }

    handlePassword (event) {
        localStorage.setItem(passvar,event.target.value)
    }

    handleUser (event) {
        this.setState({'_submitDisabled':false, '_username':event.target.value});
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
        let uParams = document.location.search;
        url = url.replace(uParams,'');
        this.props.updateDomain(url + '/' + newId + uParams);
    }

    /* CUSTOM */
    pushApi(submitted) {
        let instanceApi = SAVE_FEATURES.find(x => x.instance === this.props.value.instanceName);
        let saveData = JSON.parse(localStorage.getItem('_meta')) || false;
        if (saveData) {
            let formInstanceUrl = saveData.instanceName + '/' + saveData.formId + '/' + localStorage.getItem('_cache');
            saveData = {
                user_id: saveData.user,
                organization_id: saveData.org,
                form_id: saveData.formId,
                form_instance_id: saveData.instanceName,
                form_instance_url: formInstanceUrl,
                submitted: submitted,
                updated_at: new Date(),
            }
        }
        if (instanceApi) {
            instanceApi = instanceApi.save ? (instanceApi.api + '/submission') : false;
        }
        if (saveData && instanceApi) {
            axios.post('https://' + instanceApi, saveData, {headers: {'Content-Type':'application/json'}})
                .then(res => {
                    console.log(res);
                })
                .catch(e => {
                    console.log(e);
                    PopupError("Something went wrong");
                });
        }
    }
    /* END CUSTOM */

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
                            /* CUSTOM */
                            this.pushApi(false);
                            /* END CUSTOM */
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
                            /* CUSTOM */
                            this.pushApi(false);
                            /* END CUSTOM */
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
        const that = this.props;
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
                                            PopupError("Something went wrong");
                                            console.error(file.error)
                                            this.setState({_showSpinner: false })
                                        })
                                    } else {
                                        axios.get('https://' + this.props.value.instanceName + '.akvoflow.org/processor', {
                                            params: {
                                                action: 'submit',
                                                formID: formInstance.formId,
                                                fileName: zipFileName,
                                                devId: formInstance.devId
                                            }
                                        })
                                        .then(res => {
                                            /* CUSTOM */
                                            this.pushApi(true);
                                            /* END CUSTOM */
                                            PopupSuccess("New datapoint is sent! clearing form...");
                                            this.setState({_showSpinner: false })
                                            setTimeout(function () {
                                                db.delete()
                                                let username = localStorage.getItem('_username');
                                                localStorage.clear();
                                                localStorage.setItem('_username', username);
                                                setTimeout(function () {
                                                    that.endSurvey();
                                                }, 3000);
                                            }, 500);
                                        })
                                        .catch(e => {
                                            console.error(e);
                                            PopupError("Something went wrong");
                                            this.setState({_showSpinner: false })
                                        })

                                    }

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
                this.setState({_showSpinner: false })
            })
    }

    submitForm (e) {
        e.stopPropagation();
        this.setState({_showSpinner: true})
        const showCustomConfirmation = this.state._skipMandatories && !this.props.value.captcha;
        const dpname = localStorage.getItem('_dataPointName');
        localStorage.setItem("_submissionStop", Date.now())
        if (!dpname) {
            localStorage.setItem('_dataPointName','Untitled');
        }
        if (showCustomConfirmation) {
            PopupCustomConfirmation().then(res => {
                if (res.isConfirmed) {
                    this.sendData(localStorage);
                }
                if (!res.isConfirmed) {
                    this.setState({_showSpinner:false})
                }
            });
            return false;
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

    componentDidMount() {
        localStorage.setItem('_meta', false);
        let instance = SAVE_FEATURES.find(x => x.instance === this.props.value.instanceName);
        if (instance) {
            const skipMandatories = instance.skipMandatories
                ? instance.skipMandatories.includes(this.props.value.surveyId)
                : false;
            const password = skipMandatories ? "webform" : "";
            this.setState({
                _skipPassword: instance.skipPassword,
                _skipMandatories:skipMandatories
            });
            localStorage.setItem(passvar, survey_form.includes(USING_PASSWORDS) ? "" : password);
            instance = instance.api;
        }
        if (instance && urlParams.user_id) {
            axios.get("https://" + instance + "/flow-submitter/" + urlParams.user_id)
                .then(res => {
                    this.setState({'_username': res.data.user})
                    localStorage.setItem('_username',res.data.user);
                    let meta = res.data;
                    meta = {
                        user: parseInt(urlParams.user_id),
                        email: res.data.user,
                        instanceName: this.props.value.instanceName,
                        formId: parseInt(this.props.value.surveyId),
                        formName: this.props.value.surveyName,
                        formVersion: this.props.value.version,
                        dataPointId: localStorage.getItem('_dataPointId'),
                        dataPointName: this.props.value.datapoint,
                        org: res.data.org,
                        submitted: false
                    }
                    this.props.updateUser(res.data.user);
                    localStorage.setItem('_meta',JSON.stringify(meta));
                })
                .catch(err => console.log("INTERNAL SERVER ERROR"));
            this.setState({_hasSaveButton: true});
        }
    }

    render() {
        const submitIsActive = this.state._skipMandatories || this.props.value.submit;
        const captchaIsActive = !this.state._skipMandatories && this.props.value.captcha;
        return (
            <Fragment>
                <ReCAPTCHA
                    style={{
                        'display': captchaIsActive ? 'block' : 'none',
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
                    <div style={{ 'display': submitIsActive ? 'block' : 'none' }} >
                        <label
                            className="form-password-label"
                            htmlFor={"submit-username"}>
                            Submitter
                        </label>
                        <input
                            className="form-control"
                            type="text"
                            name="submit-username"
                            value={this.state._username}
                            onChange={this.handleUser}
                            disabled={this.state._skipPassword}
                        />
                        <label
                            className={this.state._skipPassword ? "hidden" : "form-password-label"}
                            htmlFor={"submit-password"}>
                            Password:
                        </label>
                        <input
                            className="form-control"
                            type={this.state._skipPassword ? "hidden" : "password"}
                            name="submit-password"
                            onChange={this.handlePassword}
                        />
                        <hr/>
                    </div>
                    { this.state._hasSaveButton ? (
                        <button
                            onClick={e => this.saveForm(e)}
                            className={"btn btn-block btn-primary"}
                            disabled={this.state._saveButton ? false : true}>
                            Save
                        </button>
                    ) : ""}
                    <button
                        onClick={e => this.submitForm(e)}
                        className={"btn btn-block btn-" + (submitIsActive ? "primary" : "secondary")}
                        disabled={submitIsActive ? this.state._showSpinner : true}
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
