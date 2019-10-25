import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './reducers/actions.js'
import swal from '@sweetalert/with-react'
import './App.css'
import GroupButtons from './component/GroupButtons'
import GroupHeaders from './component/GroupHeaders'
import Questions from './component/Questions'
import Pagination from './component/Pagination'
import Header from './component/Header'
import Submit from './component/Submit'
import {
    FaArrowLeft,
    FaArrowRight
} from 'react-icons/fa'

const PROD_URL = false
const API_URL = (PROD_URL ? "https://tech-consultancy.akvotest.org/akvo-flow-web-api/" : process.env.REACT_APP_API_URL)
const DELAY = 1500;

class Home extends Component {

    constructor(props) {
        super(props);
        this.instance = this.props.match.params.instance
        this.surveyId = this.props.match.params.surveyid
        this.setFullscreen = this.setFullscreen.bind(this)
        this.selectGroup = this.selectGroup.bind(this)
        this.state = {
            _fullScreen: false,
            _prevGroup: false,
            _nextGroup: true,
            _totalGroup: this.props.value.groups.length
        }
    }

    updateData = (data) => {
        this.props.loadQuestions(data)
        this.props.restoreAnswers(this.props.value.questions)
        if(localStorage.getItem("_dataPointName")){
            this.props.reduceDataPoint(localStorage.getItem('_dataPointName'))
        }
        this.props.changeGroup(1)
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
            _nextGroup: (data.questionGroup.length >= 1 ? 0 : 1),
            _currentGroup: 0,
            _prevGroup: 0,
            _totalGroup: data.questionGroup.length
        })
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

    setFullscreen() {
        const currentState = this.state._fullscreen
        this.setState({
            _fullscreen: !currentState
        })
    }

    selectGroup = () => {
        this.setState({
            _prevGroup:false,
            _nextGroup:true
        })
    }

    componentDidMount() {
        this.props.generateUUID({})
        localStorage.setItem("_formId", this.surveyId)
        localStorage.setItem("_instanceId", this.instance)
        axios.get(API_URL+ this.instance + '/' + this.surveyId + '/en')
            .then(res => {
                this.updateData(res.data)
            })
            .catch(error => {
                // swal("Oops!", "Something went wrong!", "error")
            })
		setTimeout(() => {
                  this.setState({ load: true });
        }, DELAY);
    }

    render() {
        return (
            <div className={this.state._fullscreen ? "wrapper d-flex toggled": "wrapper d-flex"}>
                <div className="sidebar-wrapper bg-light border-right">
                    <Header/>
                    <GroupButtons />
                    <Submit />
                </div>
                <div className="page-content-wrapper">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                        <button className="btn btn-primary" onClick={this.setFullscreen}>
                            {this.state._fullscreen ? <FaArrowRight /> : <FaArrowLeft />}
                        </button>
                        <div className="data-point">
                        <h3 className="data-point-name">{this.props.value.datapoint}</h3>
                        <span className="text-center data-point-id">{this.props.value.uuid}</span>
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
                        <GroupHeaders />
                        <Questions />
                    </div>
                </div>
            </div>
        )
    };
}
//<Questions />

export default connect(mapStateToProps, mapDispatchToProps)(Home);
