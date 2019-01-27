import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { notify, tipAuthor } from '../utils/helpers';
import {
  callMethodMakeUpVote,
  callMethodMakeDownVote,
  callMethodGetAllPosts,
  callEventsByName,
} from '../utils/contractAPI';

import {
  setLastTransaction,
  getAllPostItPosts,
} from '../actions/ethContract';

const Post = (props) => {


  const { authedUser, ethContract, dispatch, postId, title, content, author, votes, authorAddress, postComments } = props;
  let allPostComments = [];

  if (postComments.length <= 0) {
    callEventsByName(ethContract.postItContract, 'comments', { postId: postId })
      .then((comments) => {
        console.log(comments);
        allPostComments = (comments && comments.length > 0) ? comments : postComments;
      });
  }

  const upVote = async (postId) => {
    if (postId > 0) {
      await callMethodMakeUpVote(ethContract.postItContract, postId, authedUser.accountAddress)
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
  };

  const downVote = async (postId) => {
    if (postId > 0) {
      await callMethodMakeDownVote(ethContract.postItContract, postId, authedUser.accountAddress)
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
  };

  return (
    <Fragment>
      <li className="media">
        <div className="media-body">
          <h4 className="media-heading"><Link to={`/posts/${postId}`} className="post-title">{title}</Link></h4>
          <div className="media-content">{content}</div>
          <div className="media-author">Author: {author}</div>
          <div className="media-author-votes">Vote count: {votes}</div>
          <div className="media-actions">
            <span className="glyphicon glyphicon-circle-arrow-up" aria-hidden="true" alt="vote up" onClick={(e) => upVote(postId)}></span>
            <span className="glyphicon glyphicon-circle-arrow-down" aria-hidden="true" alt="vote down" onClick={(e) => downVote(postId)}></span>
            <span className="glyphicon glyphicon-piggy-bank" aria-hidden="true" alt="tip author" onClick={(e) => tipAuthor(ethContract.web3, authedUser.accountAddress, authorAddress)}></span>
            <span className="glyphicon glyphicon-comment" aria-hidden="true" alt="comments"></span> <span>{allPostComments.length}</span>
          </div>
        </div>
      </li>
    </Fragment>
  );
}

export default withRouter((Post));
