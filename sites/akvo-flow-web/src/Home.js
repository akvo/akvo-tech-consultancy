import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './reducers/actions.js'
import './App.css'
import 'filepond/dist/filepond.min.css';
import GroupButtons from './component/GroupButtons'
import GroupHeaders from './component/GroupHeaders'
import DataPoint from './component/DataPoint'
import Questions from './component/Questions'
import Pagination from './component/Pagination'
import Header from './component/Header'
import Submit from './component/Submit'
import {
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa'
import { PopupError } from './util/Popup.js'
import { PROD_URL } from './util/Environment.js'
import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'

const API_URL = (PROD_URL ? window.location.href.replace("flow-web","flow-web-api") : process.env.REACT_APP_API_URL)
const CACHE_URL = (PROD_URL ? "update" : "fetch")

class Home extends Component {

    constructor(props) {
        super(props);
        this.instance = this.props.match.params.instance;
        this.surveyId = this.props.match.params.surveyid;
        this.setFullscreen = this.setFullscreen.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderGroups = this.renderGroups.bind(this);
        this.state = {
            _fullScreen: false,
            _rendered: false
        }
        this.uppy = Uppy({ debug: true })
            .use(AwsS3, {
                getUploadParameters: function (file) {
                    const folder = file.type === 'application/zip' ? 'devicezip' : 'images';
                    console.log(file);
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
    }

    updateData = (data) => {
        data = {...data, instanceName: this.props.match.params.instance};
        this.props.loadQuestions(data)
        this.props.loadGroups(data)
        this.props.restoreAnswers(this.props.value.questions)
        this.props.reduceGroups()
        if (localStorage.getItem("_dataPointName")){
            this.props.reduceDataPoint(localStorage.getItem('_dataPointName'))
        }
        this.props.changeGroup(1)
        localStorage.setItem("_version", data.version)
        localStorage.setItem("_instanceId", data.app)
        let questionGroupArray = Array.isArray(data.questionGroup)
        if (!questionGroupArray) {
            data.questionGroup = [data.questionGroup];
        }
        this.props.updateLocalStorage();
        this.setState({
            ...data,
        })
        let dataPointId = [
            Math.random().toString(36).slice(2).substring(1, 5),
            Math.random().toString(36).slice(2).substring(1, 5),
            Math.random().toString(36).slice(2).substring(1, 5)
        ]
        localStorage.setItem("_dataPointId", dataPointId.join("-"))
        localStorage.setItem("_submissionStart", Date.now())
        localStorage.setItem("_deviceId", "Akvo Flow Web")
    }

    updateQuestions = (index) => {
        this.setState({
            questionIndex: index
        })
    }

    setFullscreen() {
        const currentState = this.state._fullscreen
        this.setState({
            _fullscreen: !currentState
        })
    }

    componentWillUnmount() {
        this.uppy.close();
    }

    componentDidMount() {
        this.props.generateUUID({})
        this.props.changeSettings({_isLoading:true})
        if (localStorage.getItem("_formId")) {
            if (localStorage.getItem("_formId") !== this.surveyId){
                localStorage.clear();
            }
        }
        localStorage.setItem("_formId", this.surveyId)
        localStorage.setItem("_instanceId", this.instance)
        let SURVEY_API = (PROD_URL ? API_URL : API_URL + this.instance + '/' + this.surveyId);
        axios.get(SURVEY_API + '/' + CACHE_URL)
            .then(res => {
                this.updateData(res.data)
                this.setState({ _rendered:true });
                this.props.changeSettings({_isLoading:false})
            })
            .catch(error => {
                if (error.response.status === 403) {
                    this.props.showError();
                    setTimeout(() => {
                        this.setState({_fullscreen: true});
                    }, 3000);
                } else {
                    PopupError("Network Error");
                    this.props.showError();
                }
            });
    }

    renderQuestions(uppy) {
        return (
            <Questions uppy={uppy} />
        )
    }

    renderGroups() {
        return (
            <GroupButtons />
        )
    }

    render() {
        return (
            <div className={this.state._fullscreen ? "wrapper d-flex toggled": "wrapper d-flex"}>
                <div className="sidebar-wrapper bg-light border-right">
                    <Header/>
                    {this.state._rendered ? this.renderGroups() : ""}
                    {( this.props.value.questions.length === 1 ? "" : (<Submit uppy={this.uppy} />) )}
                </div>
                <div className="page-content-wrapper">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                        <button className="btn btn-primary" onClick={this.setFullscreen}>
                            {this.state._fullscreen ? <FaArrowRight /> : <FaArrowLeft />}
                        </button>
                        {( this.props.value.questions.length === 1 ? "" : (<DataPoint />) )}
                        <Pagination />
                    </nav>
                    <GroupHeaders />
                    <div className="container-fluid fixed-container" key={'div-group-'+this.state.surveyId}>
                        {this.state._rendered ? this.renderQuestions(this.uppy) : ""}
                    </div>
                </div>
            </div>
        )
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
