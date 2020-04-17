import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.showGroup = this.showGroup.bind(this);
    }

    showGroup(group) {
        return this.props.changeGroup(group)
    }

    render() {
        const prev_disabled = this.props.value.groups.active <= 1 ? true : false
        const next_disabled = this.props.value.groups.active === this.props.value.groups.list.length ? true : false
        const prev_class = this.props.value.groups.active <= 1 ? "btn-secondary" : "btn-primary"
        const next_class = this.props.value.groups.active === this.props.value.groups.list.length ? "btn-secondary" : "btn-primary"
        const prev_target = this.props.value.groups.active - 1;
        const next_target = this.props.value.groups.active + 1;
        return (
            <div className="btn btn-group ml-auto mt-2 mt-lg-0">
                <button
                    className={"btn " + prev_class}
                    onClick={() => {this.showGroup(prev_target)}}
                    disabled={prev_disabled}
                >
                    Prev
                </button>
                <button
                    className={"btn " + next_class}
                    onClick={() => {this.showGroup(next_target)}}
                    disabled={next_disabled}
                >
                    Next
                </button>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
