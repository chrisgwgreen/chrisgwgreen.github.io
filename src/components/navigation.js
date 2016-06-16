import React from 'react'
import ReactDOM from 'react-dom'
import Link from './link'

class Project extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            isMenuOpen: false
        }

        this.getContent = this.getContent.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick() {

        this.setState({
            isMenuOpen: !this.state.isMenuOpen
        })

    }

    getContent() {

        if (this.state.isMenuOpen) {

            return (
                <nav>
                    <Link title="Home" to=""/>
                    <Link title="Award" to="award"/>
                    <Link title="Award 1" to="award" lid="1"/>
                    <Link title="Project" to="project"/>
                </nav>
            )

        } else {

            return "";

        }

    }

    render() {

        return (
            <div className="navigation">
                {this.getContent()}
                <button className="menu" onClick={this.handleClick}></button>
            </div>
        )

    }

}

export default Project;
