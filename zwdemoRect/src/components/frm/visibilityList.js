import { connect } from 'react-redux'
import { toggleFrm } from '../../redux/actions'
import FrmList from './frmlist'

const getVisibleTodos = (frms, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return frms
    case 'SHOW_COMPLETED':
      return frms.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return frms.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    frms: getVisibleTodos(state.frms, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFrmClick: (id) => {
      dispatch(toggleFrm(id))
    }
  }
}

const VisibleFrmList = connect(
  mapStateToProps,
  mapDispatchToProps
)(FrmList)

export default VisibleFrmList
