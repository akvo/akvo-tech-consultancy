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
import Clear from './component/Clear'
import Header from './component/Header'
import Submit from './component/Submit'
import Overview from './component/Overview'
import OverviewButton from './component/OverviewButton'
import {
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa'
import { PopupError } from './util/Popup.js'
import { API_URL, READ_CACHE } from './util/Environment.js'
import Dexie from 'dexie';

class Home extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.instance = this.props.match.params.instance;
        this.surveyId = this.props.match.params.surveyid;
        this.cacheId = this.props.match.params.cacheid === undefined ? false : this.props.match.params.cacheid;
        this.getSurvey = this.getSurvey.bind(this);
        this.getCachedSurvey = this.getCachedSurvey.bind(this);
        this.restoreCached = this.restoreCached.bind(this);
        this.setFullscreen = this.setFullscreen.bind(this);
        this.renderQuestions = this.renderQuestions.bind(this);
        this.renderGroups = this.renderGroups.bind(this);
        this.state = {
            _fullScreen: false,
            _rendered: false
        }
    }

    updateData = (data) => {
        data = {...data, instanceName: this.props.match.params.instance};
        this.props.loadQuestions(data);
        this.props.loadGroups(data);
        this.props.replaceAnswers(this.props.value.questions);
        this.props.reduceGroups();
        if (localStorage.getItem("_dataPointName")){
            this.props.reduceDataPoint(localStorage.getItem('_dataPointName'))
        }
        this.props.changeGroup(1);
        let questionGroupArray = Array.isArray(data.questionGroup);
        if (!questionGroupArray) {
            data.questionGroup = [data.questionGroup];
        }
        this.setState({
            ...data,
        })
        if (!this.cacheId) {
            let dataPointId = [
                Math.random().toString(36).slice(2).substring(1, 5),
                Math.random().toString(36).slice(2).substring(1, 5),
                Math.random().toString(36).slice(2).substring(1, 5)
            ]
            this.props.updateLocalStorage();
            localStorage.setItem("_dataPointId", dataPointId.join("-"));
            localStorage.setItem("_submissionStart", Date.now());
            localStorage.setItem("_deviceId", "Akvo Flow Web");
            localStorage.setItem("_version", data.version);
            localStorage.setItem("_instanceId", data.app);
        }
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

    getSurvey() {
        localStorage.setItem("_formId", this.surveyId)
        localStorage.setItem("_instanceId", this.instance)
        let SURVEY_API = API_URL + this.instance + '/' + this.surveyId + '/' + READ_CACHE;
        axios.get(SURVEY_API)
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

    restoreCached(cached) {
        localStorage.clear();
        for (let c in cached) {
            if (c === "__files__") {
                let file = cached[c].filter(f => f!== null);
                let filelist = {};
                file.forEach((f) => {
                    const db = new Dexie('akvoflow');
                    db.version(1).stores({files: 'id'});
                    db.files.put({id: f.id, fileName: f.fileName, blob: f.blob, qid: f.qid})
                    filelist = {
                        ...filelist,
                        [f.id]: f.fileName
                    };
                })
                localStorage.setItem('__files__', JSON.stringify(filelist));
            }
            if (Array.isArray(cached[c])) {
                if (c !== "__files__") {
                    localStorage.setItem(c, JSON.stringify(cached[c]));
                }
            } else {
                localStorage.setItem(c, cached[c]);
            }
        }
    }

    redirectError() {
        PopupError("URL is not available, redirecting page")
            .then(res => {
                const redirect = window.location.href.replace('/'+this.cacheId, '');
                window.location.replace(redirect);
            });
    }

    getCachedSurvey() {
        console.log(API_URL)
        axios.get(API_URL + 'form-instance/' + this.cacheId)
            .then(res => {
                let stored = JSON.parse(res.data.state);
                this.props.urlState(true);
                if (stored._formId !== this.surveyId) {
                    this.redirectError();
                    return false;
                }
                let formChanged = localStorage.getItem('_cache') === this.cacheId ? true : false;
                let changes = [];
                if (formChanged){
                    let questions = stored.questionId.split(',');
                    let answers = JSON.parse(JSON.stringify(localStorage));
                    questions.forEach((id) => {
                        if (stored[id] !== undefined && answers[id] !== undefined) {
                            changes = [
                                ...changes,
                                stored[id] !== answers[id]
                            ];
                        }
                    });
                }
                changes = changes.filter(x => x).length > 0;
                if(changes && formChanged) {
                    this.getSurvey();
                } else {
                    this.getSurvey();
                    this.restoreCached(stored);
                    localStorage.setItem("_cache",this.cacheId);
                }
                return true;
            })
            .catch(res => {
                this.redirectError();
            });
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.props.generateUUID({})
            this.props.changeSettings({_isLoading:true})
            if (localStorage.getItem("_formId")) {
                if (localStorage.getItem("_formId") !== this.surveyId){
                    localStorage.clear();
                }
            }
            if (this.cacheId) {
                this.getCachedSurvey();
            } else {
                if (localStorage.getItem('_cache') !== null) {
                    this.props.urlState(true);
                }
                this.getSurvey();
            }
        }
    }

    componentWillUnmount() {
        this._isMounted=false;
    }

    renderQuestions() {
        return (
            <Questions/>
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
                    <OverviewButton />
                    {( this.props.value.questions.length === 1 ? "" : (<Submit cacheId={this.cacheId}/>) )}
                </div>
                <div className="page-content-wrapper">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                        <button className="btn btn-primary" onClick={this.setFullscreen}>
                            {this.state._fullscreen ? <FaArrowRight /> : <FaArrowLeft />}
                        </button>
                        {( this.props.value.questions.length === 1 ? "" : (<DataPoint />) )}
                        <Clear reloadhome={this.getSurvey}/>
                        <Pagination />
                    </nav>
                    {( this.props.value.overview ? (<Overview/>) : (<GroupHeaders />))}
                    {( this.props.value.overview
                    ? ""
                    : (<div
                        className="container-fluid fixed-container"
                        id="form-container"
                        key={'div-group-'+this.state.surveyId}>
                        {this.state._rendered ? this.renderQuestions() : ""}
                        </div>)
                    )}
                </div>
            </div>
        )
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
