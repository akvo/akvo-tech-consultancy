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
            active: 'Select Program',
            disabled: true
        };
        this.changeActive = this.changeActive.bind(this);
        this.saveValues = this.saveValues.bind(this);
    }

    saveValues({id, parent_id, code, name, units, description, country_values, total}) {
        let valuesMap = country_values.map((x) => {
            return {
                id: x.country.id,
                code: x.country.code,
                name: x.country.name,
                value: x.value,
            }
        });
        let data = {
            id: id,
            parent_id: parent_id,
            code: code,
            name: name,
            units: units,
            description: description,
            value: total.values,
            countries: total.countries,
            values: valuesMap
        };
        this.setState({disabled: false});
        this.props.chart.value.append(data);
        return true;
    }

    changeActive(id, parent_id, name, depth) {
        let category;
        let countries;
        this.setState({active: name});
        let current = this.props.data[this.props.depth];
            current = current.find((x) => x.id === id);
        if (current.hasOwnProperty('childs')){
            this.props.filter.program.append(current.childs, this.props.depth);
            let next_name = current.childs[0].name;
            let next_id = current.childs[0].id;
            let next_parent_id = current.childs[0].parent_id;
            this.props.filter.program.update(next_id, next_parent_id, next_name, this.props.depth + 1);
        }
        this.props.filter.program.update(id, parent_id, name, this.props.depth);
        let filter = depth === 2 ? 'id' : 'parent_id';
            filter = depth === 0 ? false : filter;
        let charts = this.props.value.charts.data;
        let chartisnew = charts.find((x => x[filter] === id))
            chartisnew = chartisnew ? false : true;
        if (depth === 0 && chartisnew) {
            let category = this.props.value.filters.selected[depth + 1];
            chartisnew = charts.find((x => x.parent_id === category.id));
            chartisnew = chartisnew ? false : true;
            depth += 1;
            id = category.id;
        }
        if (depth === 1 && chartisnew) {
            this.props.page.loading(true);
            axios.get('/api/value/category/' + id)
                .then(res => {
                    res.data.map((data) => {
                        this.saveValues(data);
                    });
                    return true;
                })
                .then(res => {
                    let countries = this.props.value.filters.selected[depth + 1];
                    this.props.chart.value.select(countries.id);
                    this.props.page.loading(false);
                });
        }
        if (depth === 1 && !chartisnew) {
            this.props.chart.state.loading();
            countries = this.props.value.filters.selected[depth + 1];
            this.props.chart.value.select(countries.id);
        }
        if (depth === 2) {
            this.props.chart.state.loading();
            this.props.chart.value.select(id);
        }
    }

    loadDefault() {
        setTimeout(() => {
            if (this.props.value.filters.list.length === 1){
                console.log(this.props.data);
                let selected = this.props.value.filters.list[0][0];
                console.log(selected);
                this.changeActive(selected.id, selected.parent_id, selected.name, 0);
                return true;
            }
        }, 3000);
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
                    e => this.changeActive(dd.id, dd.parent_id, dd.name, depth)
                }
                value={dd.id}
            >
                {dd.name}
            </Dropdown.Item>
        )
    }

    render() {
        let depth = this.props.depth;
        let filters = this.props.data[depth];
        let selected = this.props.value.filters.selected[depth];
        selected = selected ? selected : this.state.active;
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    <div className="dropdown-fix">
                    { selected.name }
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
