
                <div className="sidebar-wrapper bg-light border-right">
                    <Header data={this.state}></Header>
                    <QuestionGroup
                        onSelectGroup={this.selectGroup}
                        header={this.state}
                        data={this.state.questionGroup}
                        surveyId={this.surveyId}
                        currentActive={this.state._currentGroup}
                    />
                    {this.props.value.submit ? false  : this.showCaptcha()}
                    <div className="submit-block">
                        <button
                            onClick={this.submitForm}
                            className={"btn btn-block btn-" + ( this.props.value.submit ? "secondary" : "primary")
                            }
                            disabled={this.state._cannotSubmit}
                        >
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
                        <Fragment>
                            <QuestionList
                                data={this.state.activeQuestions}
                                dataPoint={this.dataPoint}
                                classes={this.state._allClasses}
                                key="2"/>
                        </Fragment>
                    </div>
                </div>
        if (localStorage.getItem("answerType")) {
            console.log("executed")
            let dataType = localStorage.getItem("answerType");
            let photos = [];
            let questionId = localStorage.getItem("questionId").split(",");
            dataType.split(",").forEach(function(x, i) {
                if (x === "PHOTO") { photos.push(questionId[i]); }
            });
            photos.forEach(function(x, i) {
                if(localStorage.getItem(x)){
                    localStorage.removeItem(x);
                };
            });
        };
