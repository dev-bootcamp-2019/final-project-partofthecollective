/**
 * Package imports
 */
import Web3 from 'web3';
import contract from 'truffle-contract';

import PostItContract from '../contractBuilds/contracts/PostIt.json';
import { rpcConfig } from '../config/config';

/**
 * Constants
 * @type {string}
 */
export const WEB3_CONNECTED = 'WEB3_CONNECTED';
export const WEB3_DISCONNECTED = 'WEB3_DISCONNECTED';
export const POSTIT_CONTRACT_INSTANTIATED = 'POSTIT_CONTRACT_INSTANTIATED';
export const POSTIT_POSTS_FETCHED = 'POSTIT_POSTS_FETCHED';
export const POSTIT_POST_ADDED = 'POSTIT_POST_ADDED';
export const POSTIT_GET_POST = 'POSTIT_GET_POST';
export const WEB3_CONNECTED_ACCOUNT_SET = 'WEB3_CONNECTED_ACCOUNT_SET';
export const POSTIT_SET_LAST_TRANSACTION = 'POSTIT_SET_LAST_TRANSACTION';

/**
 * Initialized state
 * @type {{web3: null, user: null, authedUser: null, post: null, posts: Array, accountAddress: null, lastTransaction: null}}
 */
export const initialState = {
  web3: null,
  user: null,
  authedUser: null,
  post: null,
  posts: [],
  accountAddress: null,
  lastTransaction: null,
};

/**
 * web3Connect action
 * @param dispatch
 * @returns {*}
 */
export function web3connect(dispatch) {
  const web3 = window.ethereum;
  let web3Instance;
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider.
    web3.enable();
    web3Instance = new Web3(web3);
    dispatch({
      type: WEB3_CONNECTED,
      payload: web3Instance,
    });
  } else {
    const rpcURL = `${rpcConfig.protocol}://${rpcConfig.host}:${rpcConfig.port}`;
    web3Instance = new Web3(new Web3.providers.HttpProvider(rpcURL));
    dispatch({
      type: WEB3_CONNECTED,
      payload: web3Instance,
    });
  }
  return web3Instance;
}

/**
 * instantiatePostItContract action
 * @param dispatch
 * @param web3
 * @returns {Q.Promise<any> | Promise.<T>}
 */
export function instantiatePostItContract(dispatch, web3) {
  const postIt = contract(PostItContract);
  postIt.setProvider(web3.currentProvider);
  return postIt.deployed().then((deployedContract) => {
    try {
      dispatch({
        type: POSTIT_CONTRACT_INSTANTIATED,
        payload: deployedContract,
      });
    } catch (e) {
      console.log(e);
      //throw new Error('Error: could not dispatch to instantiatePostItContract action.');
    }
  }).catch((e) => { console.log(e); });
}

/**
 * getMetaMaskAccount action
 * @param dispatch
 * @param web3
 */
export function getMetaMaskAccount(dispatch, web3) {
  if (web3) {
    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return err;
      }
      dispatch({
        type: WEB3_CONNECTED_ACCOUNT_SET,
        payload: accounts[0],
      });
    });
  }
}

/**
 * getAllPostItPosts action
 * @param posts
 * @returns {function(*)}
 */
export function getAllPostItPosts(posts) {
  return (dispatch) => {
    try {
      dispatch({
        type: POSTIT_POSTS_FETCHED,
        payload: posts,
      });
    } catch (e) {
      //throw new Error('Error: could not dispatch to getAllPostItPosts action.');
      console.log(e);
    }
  }
}

/**
 * addNewPost action
 * @param post
 * @returns {function(*)}
 */
export function addNewPost(post) {
  return (dispatch) => {
    try {
      dispatch({
        type: POSTIT_POST_ADDED,
        payload: post,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * setLastTransaction action
 * @param transaction
 * @returns {function(*)}
 */
export function setLastTransaction(transaction) {
  return (dispatch) => {
    try {
      dispatch({
        type: POSTIT_SET_LAST_TRANSACTION,
        payload: transaction,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * getPost action
 * @param post
 * @returns {function(*)}
 */
export function getPost(post) {
  return (dispatch) => {
    try {
      dispatch({
        type: POSTIT_GET_POST,
        payload: post,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

