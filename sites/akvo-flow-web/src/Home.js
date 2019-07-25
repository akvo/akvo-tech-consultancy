import React, { Component } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import uuid from 'uuid/v4'
import './App.css'
import axios from 'axios';
import Header from './component/Header'
import Pagination from './component/Pagination'
import QuestionGroup from './service/QuestionGroup'
import QuestionList from './service/QuestionList'

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
        this.state = {
            questionGroup:[],
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
    }

    dataPoint = ((a) => (this.setState({ _dataPointName: a })))

    // Fetching the API Update
    selectGroup = (index) => {
        let ng = (index === this.state._totalgroup ? 0 : (index + 1))
        let pg = (index <= 0 ? index : (index - 1))
        this.setState({
            activeGroup:this.state.questionGroup[index].heading,
            activeQuestions:this.state.questionGroup[index].question,
            _currentGroup:index,
            _nextGroup: ng,
            _prevGroup:pg
        })
    }

    updateData = (data) => {
        localStorage.setItem("_version",data.version)
        localStorage.setItem("_instanceId",data.app)
        let questionId = []
        let answerType = []
        data.questionGroup.forEach((g) => {
            g.question.forEach((q,i) => {
                questionId.push(q.id)
                answerType.push(q.type.toUpperCase())
            })
        })
        localStorage.setItem("questionId",questionId)
        localStorage.setItem("answerType",answerType)
        this.setState({
            ...data,
            activeGroup:data.questionGroup[0].heading,
            activeQuestions:data.questionGroup[0].question,
            _nextGroup:(data.questionGroup.length >= 1 ? 0 : 1),
            _currentGroup:0,
            _prevGroup:0,
            _totalGroup:data.questionGroup.length
        })
        this.selectGroup (this.state.questionIndex)

        localStorage.setItem('_uuid', uuid())
        let dataPointId  = [
            Math.random().toString(36).slice(2).substring(1,5),
            Math.random().toString(36).slice(2).substring(1,5),
            Math.random().toString(36).slice(2).substring(1,5)
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
        localStorage.setItem("_formId",this.surveyId)
        localStorage.setItem("_instanceId",this.instance)
        axios.get('http://localhost:5000/'+this.instance+'/'+this.surveyId+'/en')
            .then(res => this.updateData(res.data))
    }

    // Animations
    setFullscreen() {
        const currentState = this.state._fullscreen
        this.setState({_fullscreen: !currentState})
    }

    submitForm() {
        localStorage.setItem("_submissionStop", Date.now())
        axios.post('http://localhost:5000/submit-form', localStorage)
            .then(res => console.log(res.data))
    }

    // Rendered Components
    render (){
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
                    <div className="submit-block">
                    <button onClick={this.submitForm} className="btn btn-block btn-primary">
                        Submit
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
                    <div className="container-fluid fixed-container" >
                        <h2 className="mt-2">{this.state.activeGroup}</h2>
                        <p>{this.state.activeGroup}</p>
                        <QuestionList data={this.state.activeQuestions} dataPoint={this.dataPoint} classes={this.state._allClasses} key={"key-1"}/>
                    </div>
                </div>
            </div>
        )
    };
}

export default Home;
