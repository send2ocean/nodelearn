const ADD_FRM='ADD_FRM'
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
const TOGGLE_FRM='TOGGLE_FRM'

let nextId = 0

export const add_frm = (text) => {
  return {
    type: ADD_FRM,
    id:nextId++,
    text
  }
}

export const setVisibilityFilter = (filter) =>{
  return {
    type:SET_VISIBILITY_FILTER,
    filter
  }
}

export const toggleFrm = (id) =>{
  return{
    type:TOGGLE_FRM,
    id
  }
}

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
