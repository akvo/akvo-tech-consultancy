import React, { Component } from 'react';
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../reducers/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from 'react-select';

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: null,
            options: []
        };
    }

    handleChange = selectedOption => {
        let adding = this.state.selectedOption === null ? true : false;
        if (!adding && selectedOption !== null) {
            adding = selectedOption.length > this.state.selectedOption.length ? true : false;
        }
        this.setState(
          { selectedOption },
        );
        if (selectedOption !== null) {
            let data = selectedOption.map(x => x.value);
            this.props.setFilters(data, this.props.type);
        } else {
            this.props.setFilters([], this.props.type);
        }
        this.props.getFilteredList(this.props.type, adding);
    }

    componentDidMount() {
        let options = this.props.value[this.props.type].map(x => {
            return {
                value: x,
                label: x
            }
        });
        this.setState({options:options});
        let isFiltered = this.props.value.selected[this.props.type].length > 0 ? true : false;
        if (isFiltered) {
            let selectedOption = this.props.value.selected[this.props.type].map((x) => {
                return {
                    value: x,
                    label: x,
                }
            })
            this.setState({selectedOption: selectedOption})
        }
    }

    render() {
        const selectedOption = this.state.selectedOption;
        return (
            <Select
                isMulti={true}
                value={selectedOption}
                onChange={this.handleChange}
                options={this.state.options}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
