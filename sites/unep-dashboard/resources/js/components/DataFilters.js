import React, { Component, useState } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Dropdown,
    FormControl
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a className="btn btn-primary btn-sm"
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
    }

    getDropDownItem (dd, depth, kind) {
        return (
            <Dropdown.Item
                key={kind + '-' +  dd.id}
                eventKey={dd.id}
                onClick={
                    e => this.props.changeActive(dd.id, dd.parent_id, dd.name, depth, kind)
                }
                value={dd.id}
            >
                {dd.name}
            </Dropdown.Item>
        )
    }

    render() {
        let kind = this.props.kind;
        let depth = this.props.depth;
        let data = kind === "primary"
            ? this.props.value.filters
            : this.props.value.filters.reducer;
        let filters = data.list[depth];
        let selected = data.selected[depth];
        selected = selected ? selected : this.state.active;
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id={"dropdown-custom-components-" + kind}>
                    <div className="dropdown-fix">
                    { selected.name }
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomMenu}
                >
                    { filters.map((x) => { return this.getDropDownItem(x, depth, kind) }) }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFilters);
