import React, { Fragment } from 'react';

import { notify } from '../utils/helpers';
import {
  callMethodMakeUpVote,
  callMethodMakeDownVote,
  callMethodGetAllPosts,
  callEventsByName,
} from '../utils/contractAPI';

import { setLastTransaction, getAllPostItPosts } from '../actions/ethContract';

const Post = (props) => {

  let postComments = [];

  const { authedUser, ethContract, dispatch, postId, title, content, author, votes, authorAddress } = props;
  
  callEventsByName(ethContract.postItContract, 'posts', { postId: postId })
    .then((comments) => {
      postComments = (comments && comments.length > 0) ? comments : [];
    });

  const upVote = (postId) => {
    if (postId > 0) {
      callMethodMakeUpVote(ethContract.postItContract, postId, authedUser.accountAddress)
        .then((response) => {
          if (response && !response.success) {
            notify(response.message.toString(), 'error');
          } else if(response && response.success) {
            dispatch(setLastTransaction(response.tx));
            notify(response.message.toString(), 'success');
          }
          return callMethodGetAllPosts(ethContract.postItContract, authedUser.accountAddress);
        })
        .then((posts) => {
          if (posts) {
            dispatch(getAllPostItPosts(posts));
          }
        });
    }
  }

  const downVote = (postId) => {
    if (postId > 0) {
      callMethodMakeDownVote(ethContract.postItContract, postId, authedUser.accountAddress)
        .then((response) => {
          if (response && !response.success) {
            notify(response.message.toString(), 'error');
          } else if(response && response.success) {
            dispatch(setLastTransaction(response.tx));
            notify(response.message.toString(), 'success');
          }
          return callMethodGetAllPosts(ethContract.postItContract, authedUser.accountAddress);
        })
        .then((posts) => {
          if (posts) {
            dispatch(getAllPostItPosts(posts));
          }
        });
    }
  }

  const tipAuthor = async (web3, from, to) => {
    if (from === to) {
      notify('You can not tip yourself, because you are the author :)', 'error');
    } else {
      let tx = await web3.eth.sendTransaction({
        from: from,
        to: to,
        value: web3.utils.toWei(".0010", "ether")
      });
      if (tx && tx.transactionHash) {
        notify(`Tip sent to author at: ${to}`, 'success');
      }
    }
  }

  return (
    <Fragment>
      <li className="media">
        <div className="media-body">
          <h4 className="media-heading">{title}</h4>
          <div className="media-content">{content}</div>
          <div className="media-author">Author: {author}</div>
          <div className="media-author-votes">Vote count: {votes}</div>
          <div className="media-actions">
            <span className="glyphicon glyphicon-circle-arrow-up" aria-hidden="true" alt="vote up" onClick={(e) => upVote(postId)}></span>
            <span className="glyphicon glyphicon-circle-arrow-down" aria-hidden="true" alt="vote down" onClick={(e) => downVote(postId)}></span>
            <span className="glyphicon glyphicon-piggy-bank" aria-hidden="true" alt="tip author" onClick={(e) => tipAuthor(ethContract.web3, authedUser.accountAddress, authorAddress)}></span>
            <span className="glyphicon glyphicon-comment" aria-hidden="true" alt="tip author"></span> <span>{postComments.length}</span>
          </div>
        </div>
      </li>
    </Fragment>
  );
}

export default (Post);
