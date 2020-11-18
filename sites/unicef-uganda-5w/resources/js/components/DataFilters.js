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
            active: 'Select Program',
            disabled: true,
        };
        this.changeActive = this.changeActive.bind(this);
    }

    changeActive(filters) {
        this.props.filter.change(filters, this.props.value.page.name)
    }

    getDropDownItem (filters) {
        return (
            <Dropdown.Item
                key={filters.id}
                eventKey={filters.id}
                onClick={
                    e => this.changeActive(filters)
                }
                value={filters.id}
            >
                {filters.text}
            </Dropdown.Item>
        )
    }

    render() {
        let property = this.props.value.filters[this.props.value.page.name].filters;
        let base = this.props.value.base;
        let filters = uniqBy(base.data, property.base).map(x => x[property.base]);
        filters = base[property.kind].filter(x => filters.includes(x.id));
        let all = {id:0, text: "All " + titleCase(property.dropdown), name: "All " + titleCase(property.dropdown)};
        if (property.id !== 0){
            filters = [all, ...filters];
        }
        filters = filters.filter(x => x.id !== property.id);
        return (
            <Fragment>
                <div className="dropdown-name">{property.dropdown}</div>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    <div className="dropdown-fix">
                        { property.id !== 0 ? property.name : all.text}
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}
                >
                    { filters.map((x) => { return this.getDropDownItem(x) }) }
                </Dropdown.Menu>
            </Dropdown>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFilters);
