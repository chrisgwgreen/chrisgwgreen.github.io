import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import portfolio from './reducers'
import App from './components/app'

let store = createStore(portfolio)

ReactDOM.render(
    <Provider store={store}>
      <App test="value"/>
    </Provider>,
    document.getElementById('root')
);
