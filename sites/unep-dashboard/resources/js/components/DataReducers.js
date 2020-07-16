import React, { Component } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    ButtonGroup,
    Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class DataReducers extends Component {

    constructor(props) {
        super(props);
        this.removeReducer = this.removeReducer.bind(this)
    }

    removeReducer(){
        this.props.filter.reducer.remove(this.props.data.id, this.props.data.parent_id);
        console.log(this.props);
        this.props.refresh();
    }

    render() {
        let data = this.props.value.filters.childs.find(c => c.id === this.props.data.id);
        let parent_data = this.props.value.filters.list[0].find(c => c.id === this.props.data.parent_id);
        return (
            <ButtonGroup size="sm" className="reducer">
                <Button variant="info" disabled>{parent_data.name + ':' + data.name}</Button>
                <Button className="reducer-remove" onClick={e => this.removeReducer()} variant="danger">
                    <FontAwesomeIcon icon={["fas", "times"]} />
                </Button>
            </ButtonGroup>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataReducers);
