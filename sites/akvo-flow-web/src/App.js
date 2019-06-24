import React, { Component } from 'react'
import styles from './App.css'
import axios from 'axios';
import Header from './component/Header'
import Pagination from './component/Pagination'
import QuestionGroup from './service/QuestionGroup'
import QuestionList from './service/QuestionList'

class App extends Component {


    constructor(props) {
        super(props);
        this.selectGroup = this.selectGroup.bind(this)
        this.updateData = this.updateData.bind(this)
        this.setFullscreen = this.setFullscreen.bind(this)
        this.state = {
            constant:0,
            questionGroup:[],
            questionIndex: 0,
            activeGroup: '',
            activeQuestions: [],
            _fullscreen: false,
            _canSubmit: false
        }
    }


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
        this.setState(data)
        this.setState({
            activeGroup:data.questionGroup[0].heading,
            activeQuestions:data.questionGroup[0].question,
            _nextGroup:(data.questionGroup.length >= 1 ? 0 : 1),
            _currentGroup:0,
            _prevGroup:0,
            _totalGroup:data.questionGroup.length,
            _totalGroup:data.questionGroup.length
        })
        this.selectGroup (this.state.questionIndex)
    }

    updateQuestions = (index) => {
        this.setState({
            questionIndex: index
        })
    }

    componentDidMount() {
        axios.get('http://localhost:5000/angkorsalad/22420001/en')
            .then(res =>
                this.updateData(res.data)
            )
    }

    // Animations
    setFullscreen() {
        const currentState = this.state._fullscreen
        this.setState({_fullscreen: !currentState})
    }

    // Rendered Components

    render (){
        return (
            <div className={this.state._fullscreen ? "wrapper d-flex toggled": "wrapper d-flex"}>
                <div className="sidebar-wrapper bg-light border-right">
                    <Header data={this.state}></Header>
                    <div className="list-group list-group-flush">
                    <QuestionGroup onSelectGroup={this.selectGroup} data={this.state.questionGroup}/>
                    </div>
                </div>
                <div className="page-content-wrapper">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                        <button className="btn btn-primary" onClick={this.setFullscreen}>
                           Full Screen
                        </button>
                        <Pagination onSelectGroup={this.selectGroup} data={
                            {
                             'prev':this.state._prevGroup,
                             'total':this.state._totalGroup,
                             'next':this.state._nextGroup
                            }
                        }/>
                    </nav>
                    <div className="container-fluid">
                        <h2 className="mt-2">{this.state.activeGroup}</h2>
                        <p>{this.state.activeGroup}</p>
                        <QuestionList data={this.state.activeQuestions}/>
                    </div>
                </div>
            </div>
        )
    };
}

export default App;
