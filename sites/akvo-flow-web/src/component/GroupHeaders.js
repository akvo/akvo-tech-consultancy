import { connect } from 'react-redux'
import { mapStateToProps } from '../reducers/actions.js'
import React, { Component, Fragment } from 'react'
import Loading from '../util/Loading'

class GroupHeaders extends Component {

    constructor(props) {
        super(props);
        this.getHeader = this.getHeader.bind(this)
        this.getLoading = this.getLoading.bind(this)
    }

    componentDidMount() {
    }

    getHeader = (groups) => {
        let active = groups.list.filter(g => g.index === groups.active)
        return active.map((group) => (
            <Fragment key={group.index}>
            <h2 className="mt-2" >{group.heading}</h2>
            <p>{group.heading}</p>
            </Fragment>
        ))
    }

    getLoading = () => (<Loading styles={'header-loading'}/>)

    render() {
        return (
            this.props.value.questions.length === 1 ?
            this.getLoading() : this.getHeader(this.props.value.groups)
        )
    }

}

export default connect(mapStateToProps)(GroupHeaders);
