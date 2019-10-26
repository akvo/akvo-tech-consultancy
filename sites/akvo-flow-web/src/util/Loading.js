import React from 'react'
import {
    connect
} from 'react-redux'
import {
    mapStateToProps,
    mapDispatchToProps
} from '../reducers/actions.js'
import {
    css
} from '@emotion/core'
import BeatLoader from 'react-spinners/BeatLoader'
import '../style/style.css'

const pulseloader = css ` margin: 0 auto; border-color: red; `

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: '#007bff'
        }
    }

    render() {
        return (
            <div className={this.props.styles}>
                 <h3 className="mt-2">
                   Loading Forms
                </h3>
            <BeatLoader
                css={ pulseloader }
                sizeUnit={ "px" }
                size = { 20 }
                color = { this.state.color }
            />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
