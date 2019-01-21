import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading';

import authedUser from './authedUser';
import ethContract from './ethContract';

export default combineReducers({
  authedUser,
  ethContract,
  loadingBar,
});
