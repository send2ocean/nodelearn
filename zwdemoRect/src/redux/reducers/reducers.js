const initialState = [{id:0,text:'abc',completed:false}]


const frm = (state = {},action ) =>{

  switch (action.type) {
    case "ADD_FRM":
      return {
        id: action.id,
        text: action.text,
        completed:false
      }
      break;
    case "TOGGLE_FRM":
      if(state.id !== action.id){
        return state;
      }
      return Object.assign({},state,{
        completed:!state.completed
      })
      break;

    default:
      return state;
  }
}

const frms = (state = [],action) =>{
  switch (action.type) {
    case "ADD_FRM":
      return[
        ...state,
        frm(undefined,action)
      ]
      break;
    case "TOGGLE_FRM":
      return state.map(t =>
          frm(t , action)
        )

      break;
    default:
      return state
  }
}
export default frms;
