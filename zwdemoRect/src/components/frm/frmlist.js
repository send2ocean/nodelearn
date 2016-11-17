import React, { PropTypes } from 'react'
import Frm from './frm.js'

const FrmList = ({ frms, onFrmClick }) => (
  <ul>
    {frms.map(frm =>
      <Frm
        key={frm.id}
        {...frm}
        onClick={() => onFrmClick(frm.id)}
      />
    )}
  </ul>
)

FrmList.propTypes = {
  frms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onFrmClick: PropTypes.func.isRequired
}

export default FrmList
