import {combineReducers} from 'redux'

const initialState = {
  loggedIn: false
}

function userReducer(state, action) {
  switch (action.type) {
    case 'LOGGED_IN':
      return {...state, loggedIn: true}
    case 'LOGGED_OUT':
      return {...state, loggedIn: false}
    default:
      return initialState
  }
}

export const allReducers = combineReducers({user: userReducer})
