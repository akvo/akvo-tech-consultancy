import React, { Component, useState } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js';
import {
    Dropdown,
    FormControl
} from 'react-bootstrap';
import { checkCache, titleCase } from "../data/utils.js";
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
        let cache = checkCache(id);
        if (id !== null && cache){
            this.props.filter.location.push(cache);
            this.props.filter.category.change(id, depth)
            return;
        }
        this.props.chart.state.loading(true);
        if (id === null && depth === 1) {
            this.props.filter.category.clear();
            this.props.chart.state.loading(false);
            let all = this.props.value.filters.list
                .filter(x => x.parent_id === null)
                .map(x => x.id)
            let merged = [];
            all.forEach(id => {
                cache = checkCache(id);
                if (cache) {
                    cache.forEach(c => {
                        merged = [...merged, c];
                    });
                    return;
                }
                axios.get(prefixPage + "locations/values/" + id)
                    .then(res => {
                        res.data.forEach(d => {
                            merged = [...merged, d];
                        });
                        localStorage.setItem('locval_' + id, JSON.stringify(res.data));
                        return true;
                    });
            });
            this.props.filter.location.push(merged);
            return;
        }
        const changes = () => {
            return new Promise((resolve, reject) => {
                this.props.filter.category.change(id, depth)
                resolve("promise");
            });
        }
        changes().then(res =>{
            let endpoint = parent_id !== null ? ( "/" + parent_id + "/" + id) :  "/" + id;
            endpoint = id === null && depth === 1 ? "" : endpoint;
            axios.get(prefixPage + "locations/values" + endpoint)
                .then(res => {
                    localStorage.setItem('locval_' + id,JSON.stringify(res.data));
                    this.props.filter.location.push(res.data);
                    this.props.chart.state.loading(false);
                }).catch(res => {
                    this.props.chart.state.loading(false);
                });
            return;
        });
        return true;
    }

    loadDefault() {
        return;
    }

    componentDidMount() {
        this.loadDefault();
    }

    getDropDownItem (dd, depth) {
        let name = titleCase(dd.name);
        return (
            <Dropdown.Item
                key={dd.id+ "-" +depth}
                eventKey={dd.id}
                onClick={
                    e => this.changeActive(dd.id, dd.parent_id, depth)
                }
                value={dd.id}
            >
                {name}
            </Dropdown.Item>
        )
    }

    render() {
        let depth = this.props.depth;
        let filters = this.props.value.filters.list;
        let active = this.props.value.filters.selected;
        filters = depth === 1
            ? filters.filter(x => x.parent_id === null)
            : filters.filter(x => x.parent_id !== null);
        let current = depth === 1 ? active.filter.domain : active.filter.sub_domain
        let selected = filters.find(x => {
            if (current === false) {
                return false;
            }
            return x.id === current
        });
        selected = selected === undefined ? "All Categories" : titleCase(selected.name);
        filters = filters.filter(x => {
            if (depth === 2 && selected === "All Categories" && !active.filter.domain) {
                return true;
            }
            if (depth === 2 && selected === "All Categories") {
                return x.parent_id === active.filter.domain;
            }
            return titleCase(x.name) !== selected
        });
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
                    {
                        selected === "All Categories" ? "" : (
                            <Dropdown.Item onClick={e => this.changeActive(null, null, depth)} value={0}>
                                All Categories
                            </Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFilters);
