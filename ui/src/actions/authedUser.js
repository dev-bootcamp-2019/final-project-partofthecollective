export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const LOG_OUT = 'LOG_OUT';

export function setAuthedUser(user) {
  return {
    type: SET_AUTHED_USER,
    payload: user,
  };
}

export function Logout() {
  return {
    type: LOG_OUT,
  }
}
