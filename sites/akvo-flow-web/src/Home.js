import React, {
    Component
} from 'react'
import {
    connect
} from 'react-redux'
import {
    createSelector
} from 'reselect'
import {
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa'
import {
    Spinner
} from 'reactstrap'
import swal from '@sweetalert/with-react';
import uuid from 'uuid/v4'
import ReCAPTCHA from "react-google-recaptcha";
import './App.css'
import axios from 'axios'
import Header from './component/Header'
import Pagination from './component/Pagination'
import QuestionGroup from './service/QuestionGroup'
import QuestionList from './service/QuestionList'
import {
    getQuestions
} from './actions/questionAction'
import {
    updateAnswer,
    getAnswer
} from './actions/answerAction'

const questionsSelector = createSelector(
    state => state.questions,
    questions => questions,
);

const answerSelector = createSelector(
    state => state.answers,
    answer => answer,
);

const mapStateToProps = createSelector(
    questionsSelector,
    answerSelector,
    state => state.questions,
    state => state.answer,
    (questions, answer) => ({
        questions,
        answer
    })
);

const mapActionsToProps = {
    onUpdateAnswer: updateAnswer,
    onRequestAnswer: getAnswer,
    onRequestQuestions: getQuestions
}


const PROD_URL = true
const API_URL = (PROD_URL ? "https://tech-consultancy.akvotest.org/akvo-flow-web-api/" : process.env.REACT_APP_API_URL)
const SITE_KEY = "6Lejm74UAAAAAA6HkQwn6rkZ7mxGwIjOx_vgNzWC"
const DELAY = 1500;

class Home extends Component {

    constructor(props) {
        super(props);
        this.instance = this.props.match.params.instance
        this.surveyId = this.props.match.params.surveyid
        this.selectGroup = this.selectGroup.bind(this)
        this.updateData = this.updateData.bind(this)
        this.setFullscreen = this.setFullscreen.bind(this)
        this.dataPoint = this.dataPoint.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.emptyForm = this.emptyForm.bind(this)
        this.state = {
			callback: "not fired",
			value:"[empty]",
			load:false,
            questionGroup: [],
            questionIndex: 0,
            activeQuestions: [],
            activeGroup: '',
            _fullScreen: false,
            _dataPointName: localStorage.getItem('_dataPointName'),
            _dataPointId: localStorage.getItem('_dataPointId'),
            _canSubmit: false,
            _currentGroup: '',
            _prevGroup: '',
            _totalGroup: '',
            _nextGroup: ''
        }
		this._reCaptchaRef = React.createRef();
    }

    dataPoint = ((a) => (this.setState({
        _dataPointName: a
    })))

    // Fetching the API Update
    selectGroup = (index) => {
        let ng = (index === this.state._totalgroup ? 0 : (index + 1))
        let pg = (index <= 0 ? index : (index - 1))
        this.setState({
            activeGroup: this.state.questionGroup[index].heading,
            activeQuestions: this.state.questionGroup[index].question,
            _currentGroup: index,
            _nextGroup: ng,
            _prevGroup: pg
        })
    }

    updateData = (data) => {
        localStorage.setItem("_version", data.version)
        localStorage.setItem("_instanceId", data.app)
        let questionId = []
        let answerType = []
        let questionGroupArray = Array.isArray(data.questionGroup)
        if (!questionGroupArray) {
            data.questionGroup = [data.questionGroup];
        }
        data.questionGroup.forEach((g) => {
            g.question.forEach((q, i) => {
                questionId.push(q.id)
                answerType.push(q.type.toUpperCase())
            })
        })
        localStorage.setItem("questionId", questionId)
        localStorage.setItem("answerType", answerType)
        this.setState({
            ...data,
            activeGroup: data.questionGroup[0].heading,
            activeQuestions: data.questionGroup[0].question,
            _nextGroup: (data.questionGroup.length >= 1 ? 0 : 1),
            _currentGroup: 0,
            _prevGroup: 0,
            _totalGroup: data.questionGroup.length
        })
        this.selectGroup(this.state.questionIndex)

        localStorage.setItem('_uuid', uuid())
        let dataPointId = [
            Math.random().toString(36).slice(2).substring(1, 5),
            Math.random().toString(36).slice(2).substring(1, 5),
            Math.random().toString(36).slice(2).substring(1, 5)
        ]
        localStorage.setItem("_dataPointId", dataPointId.join("-"))
        localStorage.setItem("_submissionStart", Date.now())
        localStorage.setItem("_deviceId", "Deden Flow Support")
    }

    updateQuestions = (index) => {
        this.setState({
            questionIndex: index
        })
    }

    //example http://localhost:5000/angkorsalad/22420001/en
    componentDidMount() {
        localStorage.setItem("_formId", this.surveyId)
        localStorage.setItem("_instanceId", this.instance)
        axios.get(API_URL+ this.instance + '/' + this.surveyId + '/en')
            .then(res => this.updateData(res.data))
            .catch(error => {
                swal("Oops!", "Something went wrong!", "error")
            })

		setTimeout(() => {
                  this.setState({ load: true });
        }, DELAY);
    }

    emptyForm() {
        localStorage.clear();
        axios.get(API_URL+ this.instance + '/' + this.surveyId + '/en')
            .then(res => this.updateData(res.data))
            .catch(error => {
                swal("Oops!", "Something went wrong!", "error")
            })
        setTimeout(() => {
                  this.setState({ load: true });
        }, DELAY);
    }

    // Animations
    setFullscreen() {
        const currentState = this.state._fullscreen
        this.setState({
            _fullscreen: !currentState
        })
    }

    submitForm() {
        localStorage.setItem("_submissionStop", Date.now())
        this.setState({'_showSpinner': true})
        axios.post(API_URL+ 'submit-form', localStorage)
            .then(res => {
                console.log(res.data)
                this.setState({'_showSpinner': false})
                swal("Success!", "New datapoint is sent!", "success")
                this.emptyForm();
                return res;
            }).catch(error => {
                swal("Oops!", "Something went wrong!", "error")
            })
    }

	handleCaptcha = value => {
		console.log("Captcha value:", value);
		this.setState({"captcha": value});
		// if value is null recaptcha expired
		if (this.state.captcha === null) this.setState({ expired: "true" });
	};

    asyncScriptOnLoad = () => {
            this.setState({ callback: "called!" });
            console.log("scriptLoad - reCaptcha Ref-", this._reCaptchaRef);
    };

    // Rendered Components
    render() {
        console.log(process.env.REACT_APP_FOO);
        return (
            <div className={this.state._fullscreen ? "wrapper d-flex toggled": "wrapper d-flex"}>
                <div className="sidebar-wrapper bg-light border-right">
                    <Header data={this.state}></Header>
                    <QuestionGroup
                        onSelectGroup={this.selectGroup}
                        header={this.state}
                        data={this.state.questionGroup}
                        surveyId={this.surveyId}
                        currentActive={this.state._currentGroup}
                    />
					<ReCAPTCHA
                        style={{
                            'display': 'block',
                            'overflow': 'hidden',
                            'border-bottom': '1px solid #ddd',
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
                    <button onClick={this.submitForm} className="btn btn-block btn-primary">
                        { this.state._showSpinner ? <Spinner size="sm" color="light" /> : "" }
                        <span>Submit</span>
                    </button>
                    </div>
                </div>
                <div className="page-content-wrapper">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                        <button className="btn btn-primary" onClick={this.setFullscreen}>
                        {this.state._fullscreen ? <FaArrowRight /> : <FaArrowLeft />}
                        </button>
                        <div className="data-point">
                        <h3 className="data-point-name">{this.state._dataPointName}</h3>
                        <span className="text-center data-point-id">{this.state._dataPointId}</span>
                        </div>
                        <Pagination onSelectGroup={this.selectGroup} data={
                            {
                             'prev':this.state._prevGroup,
                             'total':this.state._totalGroup,
                             'next':this.state._nextGroup
                            }
                        }/>
                    </nav>
                    <div className="container-fluid fixed-container" key={'div-group-'+this.state.surveyId}>
                        <h2 className="mt-2">{this.state.activeGroup}</h2>
                        <p>{this.state.activeGroup}</p>
                        <QuestionList data={this.state.activeQuestions} dataPoint={this.dataPoint} classes={this.state._allClasses} key="2"/>
                    </div>
                </div>
            </div>
        )
    };
}


export default connect(mapStateToProps, mapActionsToProps)(Home);
