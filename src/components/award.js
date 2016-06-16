import React from 'react'
import ReactDOM from 'react-dom'

class Award extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <h1>Award {this.props.aId}</h1>
            </div>
        )

    }

}

export default Award;
