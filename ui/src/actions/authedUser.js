/**
 * Constants
 * @type {string}
 */
export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const LOG_OUT = 'LOG_OUT';

/**
 * setAuthedUser action
 * @param user
 * @returns {{type: string, payload: *}}
 */
export function setAuthedUser(user) {
  return {
    type: SET_AUTHED_USER,
    payload: user,
  };
}

/**
 * Logout action
 * @returns {{type: string}}
 * @constructor
 */
export function Logout() {
  return {
    type: LOG_OUT,
  }
}
