import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AppActions from '../actions/app'

import Project from './project'
import Award from './award'
import Link from './link'
import List from './list'

class AppClass extends React.Component {

  constructor(props) {
    super(props);
    this.getContent = this.getContent.bind(this);
  }

  componentDidMount() {

    window.onhashchange = function() {
      console.log(location.hash);
    };

    const hashTag = location.hash.substring(1).split(':');

    this.props.actions.setAppState({
      state: hashTag[0],
      id: hashTag[1]
    });

  }

  shouldComponentUpdate(nextProps, nextState) {


    if (this.props.portfolio.state !== nextProps.portfolio.state || this.props.portfolio.id !== nextProps.portfolio.id) {
      return true;
    }

    return false;

  }

  getContent() {
    switch (this.props.portfolio.state) {

      case 'project':

        return (<Project/>);

      case 'award':

        if (this.props.portfolio.id >= 0) {
          return (<Award aId={this.props.portfolio.id} />);
          break;
        }

        return (<List/>);

        break;
      default:

    }
  }

  render() {

    return (
      <div>
        <h1>App</h1>
        {this.getContent()}
        <Link title="Award" to="award"/>
        <Link title="Award 1" to="award" lid="1"/>
        <Link title="Project" to="project"/>
      </div>
    )

  }

}

const mapStateToProps = (state) => {
  return {
    portfolio: state.portfolio
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppClass);

export default App;
