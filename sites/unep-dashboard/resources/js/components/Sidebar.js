import React, { Component, Fragment } from 'react';
import { redux } from 'react-redux';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { flatten } from '../data/utils.js';

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.renderFilters = this.renderFilters.bind(this);
        this.changeProps = this.changeProps.bind(this);
        this.resetProps = this.resetProps.bind(this);
        this.state = {
            active:[1],
            depth:0,
            parent_id:null
        };
    }

    changeProps(id, depth){
        let data = flatten(this.props.value.page.filters);
        let it = data.find(x => x.id === id);
        if (it.childrens.length > 0) {
            let active = it.childrens.map(x => x.id);
            active.push(id);
            if (it.parent_id){
                active.push(it.parent_id);
            }
            this.setState({active:active, depth:depth, parent_id:id});
        }
        return true;
    }

    resetProps() {
        let active = this.props.value.page.filters.map(x => x.id);
        this.setState({active:active, depth:0, parent_id:null})
    }


    renderFilters(filters, depth){
        let nest = depth + 1;
        return filters.map(
            (x, i) => {
                let active = this.props.value.data.filters.selected.includes(x.id);
                return (
                <li
                    key={x.code}
                    href="#"
                    hidden={!this.state.active.includes(x.id)}
                    className="list-group-item list-group-item-action bg-light"
                >
                    {x.childrens.length > 0 ? (
                        <Fragment>
                            <div
                                className="prev-nested parent-text"
                                hidden={this.state.parent_id !== x.id}
                                onClick={e => this.resetProps()}>
                                <FontAwesomeIcon icon={["fas", "arrow-circle-left"]}/> Back
                            </div>

                            <div className="next-nested parent-text"
                                hidden={this.state.depth !== depth}
                                onClick={e => this.changeProps(x.id, nest)}>
                                {x.name}
                            </div>
                            <div className="next-nested arrows"
                                hidden={this.state.depth !== depth}
                                onClick={e => this.changeProps(x.id, nest)}>
                                <FontAwesomeIcon icon={["fas", "arrow-circle-right"]} />
                            </div>
                            <ul className="list-group list-group-nested">
                                {this.renderFilters(x.childrens, nest)}
                            </ul>
                        </Fragment>
                    ) : (
                        <div className="next-nested"
                            onClick={e => this.props.data.toggle.filters(x.id)}>
                            <FontAwesomeIcon
                                color={active ? "green" : "grey"}
                                icon={["fas", active ? "check-circle" : "plus-circle"]}
                                className="fas-icon"
                            /> {x.name}
                        </div>
                    )}
                </li>
            )}
        )
    }

    componentDidMount() {
        let active = this.props.value.page.filters.map(x => x.id);
        this.setState({active:active, depth:0, parent_id:null})
    }

    render() {
        let filters = this.props.value.page.filters;
        return (
            <div className="bg-light border-right" id="sidebar-wrapper">
              <ul className="list-group list-group-flush">
                  {this.props.value.page.loading ? "" : this.renderFilters(filters, 0)}
              </ul>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
