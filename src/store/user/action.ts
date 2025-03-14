import {store} from '..'

export function LoginAction() {
  store.dispatch({type: 'LOGGED_IN'})
}

export function LogoutAction() {
  store.dispatch({type: 'LOGGED_OUT'})
}
