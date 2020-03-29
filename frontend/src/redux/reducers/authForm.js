export default (state = {
  isLogged: false,
  name: '',
  email: '',
  pass: ''
}, action) => {
  switch (action.type) {
    case 'TOGGLE_LOGGED':
      return {
        ...state,
        isLogged: action.logged
      }
    case 'UPDATE_FIELD':
    const { fieldType, value } = action;
      return {
        ...state,
        [fieldType]: value.trim()
      }
    default:
      return state;
  }
} 