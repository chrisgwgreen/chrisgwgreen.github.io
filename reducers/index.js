import { combineReducers } from 'redux'
import appState from './appState'



const portfolio = combineReducers({
  appState
})
console.log(portfolio);


export default portfolio
