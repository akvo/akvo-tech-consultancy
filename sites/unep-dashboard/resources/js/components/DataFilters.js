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
            dropdowns: this.props.data,
            active: 'Select Program'
        };
        this.changeActive = this.changeActive.bind(this);
        this.saveValues = this.saveValues.bind(this);
    }

    saveValues(data) {
        let dataVal = data.country_values.map((x) => {
            return {
                name: x.country.name,
                value: x.value,
                desc: x.description
            }
        })
    }

    changeActive(name, id, depth) {
        if (depth === 2) {
            axios.get('/api/value/' + id)
                .then(res => {
                    this.saveValues(res.data);
                })
        }
        console.log(depth);
        this.setState({active: name});
        let current = this.props.data[this.props.depth];
            current = current.find((x) => x.id === id);
        if (current.hasOwnProperty('childs')){
            this.props.appendFilters(current.childs, this.props.depth);
            let next_name = current.childs[0].name;
            this.props.updateSelectedFilters(next_name, this.props.depth + 1);
        }
        this.props.updateSelectedFilters(name, this.props.depth);
    }

    getDropDownItem (dd, depth) {
        return (
            <Dropdown.Item
                key={dd.id}
                eventKey={dd.id}
                onClick={e => this.changeActive(dd.name, dd.id, depth)}
                value={dd.id}
            >
                {dd.name}
            </Dropdown.Item>
        )
    }


    render() {
        let depth = this.props.depth;
        let filters = this.props.data[depth];
        let selected = this.props.value.filterSelected[depth];
        selected = selected ? selected : this.state.active;
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    { selected }
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
