import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AppActions from '../actions/app'

class AppClass extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {

    window.onhashchange = function() {
      console.log(location.hash);
    };

  }

  shouldComponentUpdate(nextProps) {

    console.log(nextProps, this.props)

    return true;
  }

  handleClick() {
    history.pushState(null,null,'#portfolio');

    this.props.actions.setAppState({
      appState: 'portfolio'
    });

  }

  render() {

    console.log(this.props);

    return (
      <div>
        <h1>App</h1>
        <button onClick={this.handleClick}>Example</button>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    appState: state.appState
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
