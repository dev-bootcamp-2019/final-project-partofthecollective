import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';


import Post from './Post';
import Comment from './Comment';
import { notify } from '../utils/helpers';
import {
  callEventsByName,
  callMethodGetPost,
  callPostComment,
  callMethodGetAllPosts,
} from '../utils/contractAPI';

import {
  getPost,
  setLastTransaction,
  getAllPostItPosts,
} from '../actions/ethContract';

const defaultState = {
  postId: 0,
  title: '',
  content: '',
  author: '',
  votes: 0,
  authorAddress: '0x00',
  postComments: [],
  loaded: false,
  events: [],
  comment: '',
};

class PostDetails extends Component {

  state = defaultState;

  async getSetPost() {
    const postId = this.props.match.params.post_id;
    const { ethContract, dispatch } = this.props;
    if (!this.state.loaded) {
      await callMethodGetPost(ethContract.postItContract, postId)
      .then((result) => {
        this.setState({
          postId: postId,
          title: result[1],
          content: result[2],
          votes: result[3].toNumber(),
          author: result[4],
          authorAddress: result[5],
          loaded: true,
        });
        dispatch(getPost(result));
        return callEventsByName(ethContract.postItContract, 'comments', { postId: postId });
      }).then((comments) => {
        console.log(comments);
        this.setState({
          postComments: (comments && comments.length > 0) ? comments : [],
        });
      });
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleComment = (e) => {
    if (!e.target.checkValidity()) {
      return;
    }
    e.preventDefault();
    const { postId, comment } = this.state;
    const { history, ethContract, accountAddress, dispatch } = this.props;
    callPostComment(ethContract.postItContract, postId, comment, accountAddress)
      .then((result) => {
        if (result && !result.success && result.message) {
          return notify(result.message.toString(), 'error');
        }
        dispatch(setLastTransaction(result.tx), notify(`You have created a comment with blockHash: ${result.tx.receipt.blockHash.toString()}`, 'success'));
        return callMethodGetAllPosts(ethContract.postItContract, accountAddress);
      })
      .then((posts) => {
        if (posts) {
          dispatch(getAllPostItPosts(posts));
          history.push('/posts/' + postId);
        }
      });
  };

  render() {
    const { authedUser, ethContract, dispatch } = this.props;
    const { postId, title, content, author, votes, authorAddress, postComments } = this.state;

    if (!ethContract.postItContract) {
      return (
        <div>Loading MetaMask...</div>
      );
    } else {
      this.getSetPost();
    }
    return(
      <Fragment>
        <h4 className="text-info">Post Details</h4>
        <ul className="media-list">
          <Post
            key={postId}
            {...this.props}
            authedUser={authedUser}
            ethContract={ethContract}
            dispatch={dispatch}
            postId={postId}
            title={title}
            content={content}
            votes={votes}
            author={author}
            authorAddress={authorAddress}
            postComments={postComments}
          />
        </ul>
        <h4 className="text-center text-info">Comments</h4>
        <form onSubmit={this.handleComment}>
          <div className="form-group">
            <label className="col-form-label">Comment</label>
          </div>
          <div className="form-group">
            <textarea
              name="comment"
              id="comment"
              placeholder="Post a comment..."
              onChange={(event) => this.handleChange(event)}
              value={this.state.comment}
              className='form-control'
              maxLength={500}
            />
          </div>

          <div className="form-group">
            <button className="btn btn-info btn-md">Submit</button>
          </div>
        </form>

        <div>
          {postComments ?
            postComments.map((comment) => <Comment authedUser={authedUser} ethContract={ethContract} commentBody={comment.commentBody} commentAuthor={comment.fullName} commentFromAddress={comment.accountAddress} />)
          : 'There are no post comments'}
        </div>
      </Fragment>
    );
  }

}

function mapStateToProps({ authedUser, ethContract, loadingBar }) {
  return {
    authedUser,
    web3: ethContract.web3,
    accountAddress: ethContract.accountAddress,
    ethContract,
    loadingBar,
  };
}

export default connect(mapStateToProps)(PostDetails);
