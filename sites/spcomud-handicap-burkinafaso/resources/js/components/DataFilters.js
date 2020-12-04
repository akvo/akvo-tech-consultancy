import React, { Component, Fragment, useState } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Dropdown,
    FormControl
} from 'react-bootstrap';
import { checkCache, titleCase } from "../data/utils.js";
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import axios from 'axios';

const prefixPage = process.env.MIX_PUBLIC_URL + "/api/";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a className="btn btn-primary"
       href=""
       ref={ref}
       onClick={e => { e.preventDefault(); onClick(e); }}
    >
        {children} <i className="fa fa-arrow-down"></i>
    </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');
    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={e => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) => !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);


class DataFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: null,
            disabled: true,
            filters: {
                survey_id: null,
                survey_name: "Loading",
                form_id: null,
                form_name: "Loading",
            }
        };
        this.changeActive = this.changeActive.bind(this);
    }

    changeActive(survey=false, form=false, filters) {
        if (survey) {
            this.setState({ ...this.state, filters: {...this.state.filters, survey_id: filters.id, survey_name: filters.name} });
        }

        if (form) {
            this.setState({ ...this.state, filters: {...this.state.filters, form_id: filters.id, form_name: filters.name} });
            setTimeout(() => this.props.filter.change(this.state.filters, this.props.value.page.name), 1000);
        }
    }

    getDropDownItem (survey=false, form=false, filters) {
        return (
            <Dropdown.Item
                key={filters.id}
                eventKey={filters.id}
                onClick={
                    e => this.changeActive(survey, form, filters)
                }
                value={filters.id}
            >
                {filters.name}
            </Dropdown.Item>
        )
    }

    render() {
        let base = this.props.value.base;
        let forms = base.surveys.find(x => x.id === this.state.filters.survey_id);

        return (
            <Fragment>
                <div className="dropdown-name">Surveys</div>
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                        <div className="dropdown-fix">Select Survey</div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomMenu}
                    >
                        { base.surveys.map((x) => { return this.getDropDownItem(true, false, x) }) }
                    </Dropdown.Menu>
                </Dropdown>

                <div className="dropdown-name">Data Sources</div>
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components-2">
                        <div className="dropdown-fix">Select Source</div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomMenu}
                    >
                        { 
                            (typeof forms !== 'undefined') ?
                                forms['forms'].map((x) => { 
                                    return this.getDropDownItem(false, true, x) 
                                }) : ""
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFilters);
