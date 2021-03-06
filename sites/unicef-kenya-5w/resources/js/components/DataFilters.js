import React, { Component, useState } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Dropdown,
    FormControl
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';

const prefixPage = process.env.MIX_PUBLIC_URL + "/api/";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a className="btn btn-primary"
       href=""
       ref={ref}
       onClick={e => { e.preventDefault(); onClick(e); }}
    >
    {children} <FontAwesomeIcon icon={["fas", "arrow-down"]} />
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
            child =>
              !value || child.props.children.toLowerCase().startsWith(value),
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
            disabled: true
        };
        this.changeActive = this.changeActive.bind(this);
    }

    changeActive(id, parent_id, depth) {
        this.props.filter.category.change(id, depth);
        if (parent_id === null) {
            parent_id = id
            id = this.props.value.filters.selected.filter;
        }
        this.props.page.loading(true);
        axios.get(prefixPage + "locations/values/" + parent_id + "/" + id)
            .then(res => {
                this.props.page.loading(false);
                this.props.filter.location.push(res.data);
            });
    }

    loadDefault() {
        return;
    }

    componentDidMount() {
        this.loadDefault();
    }

    getDropDownItem (dd, depth) {
        return (
            <Dropdown.Item
                key={dd.id}
                eventKey={dd.id}
                onClick={
                    e => this.changeActive(dd.id, dd.parent_id, depth)
                }
                value={dd.id}
            >
                {dd.name}
            </Dropdown.Item>
        )
    }

    render() {
        let depth = this.props.depth;
        let filters = this.props.value.filters.list;
        let active = this.props.value.filters.selected.filter;
        active = filters.find(x => x.id === active);
        filters = depth === 1
            ? filters.filter(x => x.parent_id === null)
            : filters.filter(x => x.parent_id !== null);
        let selected = depth === 1
            ? filters.find(x => x.id === active.parent_id)
            : active;
        filters = depth === 2
            ? filters.filter(x => x.parent_id === selected.parent_id)
            : filters;
        selected = selected.name;
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    <div className="dropdown-fix">
                    { selected }
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}
                >
                    { filters.map((x) => { return this.getDropDownItem(x, depth) }) }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFilters);
