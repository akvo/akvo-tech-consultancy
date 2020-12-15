import React, { Component } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from '../reducers/actions.js'
import { PopupAsk } from '../util/Popup.js'

class Clear extends Component {
    constructor(props) {
        super(props);
        this.confirmClear = this.confirmClear.bind(this);
    }

    confirmClear() {
        PopupAsk("Do you really want to clear all data in this current submission? This change is irreversible",
            {confirm: {opt:"Yes"}, cancel:{opt:"Cancel"}}
        ).then(res => {
            if (res.value) {
                let cacheId = localStorage.getItem('_cache');
                localStorage.clear();
                if (cacheId !== null) {
                    localStorage.setItem('_cache', cacheId);
                }
                this.props.reloadhome();
                this.props.generateUUID({});
                this.props.reduceDataPoint('');
            }
            return;
        })
    }

    render() {
        return (
            <div className="btn btn-group ml-auto mt-2 mt-lg-0">
                <button
                    className="btn btn-danger clear-btn"
                    onClick={e => this.confirmClear()}>
                    Clear
                </button>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clear);
