import React, { Component, useState } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Dropdown,
    FormControl
} from 'react-bootstrap';

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
            child =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

class DataLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 'Select Countries'
        };
        this.changeActive = this.changeActive.bind(this);
    }

    changeActive(name, id) {
        // this.props.filter.location.change(id);
        let location = this.props.value.filters.location_values.filter(x => x.id === id);
    }

    getDropDownItem (dd) {
        return (
            <Dropdown.Item
                key={dd.id}
                eventKey={dd.id}
                onClick={e => this.changeActive(dd.name, dd.id)}
                value={dd.id}
            >
                {dd.name}
            </Dropdown.Item>
        )
    }

    render() {
        let locations = this.props.value.filters.locations;
        let selected = this.props.value.filters.selected.location;
        selected = locations.find(x => x.id === selected);
        selected = selected.name;
        return (
            <Dropdown className="right-dropdowns">
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    { selected }
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}
                >
                    { locations.map((x) => { return this.getDropDownItem(x) }) }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataLocations);
