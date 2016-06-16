import React from 'react'
import ReactDOM from 'react-dom'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as AppActions from '../actions/app'

class LinkClass extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {

        let hashTag = '#' + this.props.to;
        hashTag += (this.props.lid !== undefined)
            ? ':' + this.props.lid
            : '';

        history.pushState(null, null, hashTag);

        this.props.actions.setAppState({
            state: this.props.to,
            id: this.props.lid || -1
        });

    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.props.title}
            </button>
        )
    }

}

function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(AppActions, dispatch)
    }

}

const Link = connect(null, mapDispatchToProps)(LinkClass);

export default Link;
