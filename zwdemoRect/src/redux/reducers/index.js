import { combineReducers } from 'redux'
import frms from './reducers'
import visibilityFilter from './reducer-filter'

const frmapp = combineReducers({
  frms,
  visibilityFilter
})

export default frmapp
