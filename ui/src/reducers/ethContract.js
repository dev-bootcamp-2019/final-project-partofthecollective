import {
  WEB3_CONNECTED,
  POSTIT_CONTRACT_INSTANTIATED,
  POSTIT_POSTS_FETCHED,
  POSTIT_POST_ADDED,
  POSTIT_SET_LAST_TRANSACTION,
  WEB3_CONNECTED_ACCOUNT_SET,
  initialState,
} from '../actions/ethContract';

export default function (state = initialState, action) {
  switch (action.type) {
    case WEB3_CONNECTED:
      return {
        ...state,
        web3: action.payload,
      };
    case POSTIT_CONTRACT_INSTANTIATED:
      return {
        ...state,
        postItContract: action.payload,
      };
    case POSTIT_POSTS_FETCHED:
      return {
        ...state,
        posts: action.payload,
      };
    case POSTIT_POST_ADDED:
      return {
        ...state,
        post: action.payload,
      };
    case WEB3_CONNECTED_ACCOUNT_SET:
      return {
        ...state,
        accountAddress: action.payload,
      }
    case POSTIT_SET_LAST_TRANSACTION:
      return {
        ...state,
        lastTransation: action.payload,
      }
    default:
      return state;
  }
};

