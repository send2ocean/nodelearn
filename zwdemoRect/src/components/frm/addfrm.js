import React from 'react'
import { connect } from 'react-redux'
import { add_frm } from '../../redux/actions'

let ADD_FRM = ({ dispatch }) => {
  let input

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(add_frm(input.value))
        input.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
ADD_FRM = connect()(ADD_FRM)

export default ADD_FRM
