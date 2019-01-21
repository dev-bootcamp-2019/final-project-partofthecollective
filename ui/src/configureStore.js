import { persistReducer, purgeStoredState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import combineReducers from './reducers';
import { LOG_OUT } from './actions/authedUser';

export const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
    purgeStoredState(persistConfig);
  }
  return combineReducers(state, action);
}

export const persistedReducer = persistReducer(persistConfig, rootReducer);
