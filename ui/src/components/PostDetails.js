import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { notify } from '../utils/helpers';
import {
  callMethodMakeUpVote,
  callMethodMakeDownVote,
  callMethodGetAllPosts,
  callEventsByName,
  callMethodGetPost,
} from '../utils/contractAPI';

import { setLastTransaction, getAllPostItPosts } from '../actions/ethContract';

class PostDetails extends Component {

  state = {
    postId: 0,
    title: '',
    content: '',
    author: '',
    votes: 0,
    authorAddress: '0x00',
    postComments: [],
    loaded: false,
  };

  componentDidMount() {
    const postId = this.props.match.params.post_id;
    const { ethContract } = this.props;

    if (!this.state.loaded) {
      callMethodGetPost(ethContract.postItContract, postId)
      .then((result) => {
        console.log('result',result);
        this.setState({
          postId: postId,
          title: result[1],
          content: result[2],
          author: result[3],
          votes: result[4],
          authorAddress: result[5],
          loaded: true,
        });
        console.log(callEventsByName(ethContract.postItContract, 'posts', { postId: postId }));
      });
    }
    
        //return callEventsByName(ethContract.postItContract, 'posts', { postId: postId });
      // }).then((comments) => {
      //   this.setState({
      //     postComments: (comments && comments.length > 0) ? comments : [],
      //   });
      // });

      console.log(this.state);
  }

  upVote(postId) {
    if (postId > 0) {
      callMethodMakeUpVote(this.props.ethContract.postItContract, postId, this.props.authedUser.accountAddress)
        .then((response) => {
          if (response && !response.success) {
            notify(response.message.toString(), 'error');
          } else if(response && response.success) {
            this.props.dispatch(setLastTransaction(response.tx));
            notify(response.message.toString(), 'success');
          }
          return callMethodGetAllPosts(this.props.ethContract.postItContract, this.props.authedUser.accountAddress);
        })
        .then((posts) => {
          if (posts) {
            this.props.dispatch(getAllPostItPosts(posts));
          }
        });
    }
  }

  downVote(postId) {
    if (postId > 0) {
      callMethodMakeDownVote(this.props.ethContract.postItContract, postId, this.props.authedUser.accountAddress)
        .then((response) => {
          if (response && !response.success) {
            notify(response.message.toString(), 'error');
          } else if(response && response.success) {
            this.props.dispatch(setLastTransaction(response.tx));
            notify(response.message.toString(), 'success');
          }
          return callMethodGetAllPosts(this.props.ethContract.postItContract, this.props.authedUser.accountAddress);
        })
        .then((posts) => {
          if (posts) {
            this.props.dispatch(getAllPostItPosts(posts));
          }
        });
    }
  }

  async tipAuthor(web3, from, to) {
    if (from === to) {
      notify('You can not tip yourself, because you are the author :)', 'error');
    } else {
      let tx = await web3.eth.sendTransaction({
        from: from,
        to: to,
        value: web3.utils.toWei(".0009", "ether")
      });
      if (tx && tx.transactionHash) {
        notify(`Tip sent to author at: ${to}`, 'success');
      }
    }
  }

  render() {
    const { authedUser, ethContract } = this.props;
    const { postId, title, content, author, votes, authorAddress, postComments } = this.state;
    return(
      <Fragment>
        <div className="media-body">
          <h4 className="media-heading">{title}</h4>
          <div className="media-content">{content}</div>
          <div className="media-author">Author: {author}</div>
          <div className="media-author-votes">Vote count: {votes}</div>
          <div className="media-actions">
            <span className="glyphicon glyphicon-circle-arrow-up" aria-hidden="true" alt="vote up" onClick={(e) => this.upVote(postId)}></span>
            <span className="glyphicon glyphicon-circle-arrow-down" aria-hidden="true" alt="vote down" onClick={(e) => this.downVote(postId)}></span>
            <span className="glyphicon glyphicon-piggy-bank" aria-hidden="true" alt="tip author" onClick={(e) => this.tipAuthor(ethContract.web3, authedUser.accountAddress, authorAddress)}></span>
            <span className="glyphicon glyphicon-comment" aria-hidden="true" alt="tip author"></span> <span>{postComments.length}</span>
          </div>
        </div>
      </Fragment>
    );
  }

}

function mapStateToProps({ authedUser, ethContract }) {
  return {
    authedUser,
    web3: ethContract.web3,
    accountAddress: ethContract.accountAddress,
    ethContract,
  };
}

export default connect(mapStateToProps)(PostDetails);