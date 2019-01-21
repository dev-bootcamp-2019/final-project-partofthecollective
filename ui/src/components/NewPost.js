import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { notify } from '../utils/helpers';
import { callMethodGetAllPosts, callMethodAddPost } from '../utils/contractAPI';
import { addNewPost, getAllPostItPosts, setLastTransaction } from '../actions/ethContract';

const defaultState = {
  title: '',
  content: '',
};

class NewPost extends Component {
  state = defaultState;

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleNewPost = (e) => {
    if (!e.target.checkValidity()) {
      return;
    }
    e.preventDefault();
    const { title, content } = this.state;
    const { history, ethContract, accountAddress, dispatch } = this.props;

    callMethodAddPost(ethContract.postItContract, title, content, accountAddress)
      .then((result) => {
        if (result && !result.success && result.message) {
          return notify(result.message.toString(), 'error');
        }
        dispatch(addNewPost(result.post));
        dispatch(setLastTransaction(result.tx), notify(`You created a post with blockHash: ${result.tx.receipt.blockHash.toString()}`, 'success'));
        return callMethodGetAllPosts(ethContract.postItContract, accountAddress);
      })
      .then((posts) => {
        return dispatch(getAllPostItPosts(posts));
      });
    
      history.push('/');
  }

  render() {
    const { web3, accountAddress } = this.props;
    if (!web3) {
      return (
        <div>Loading MetaMask...</div>
      );
    }
    return (
      <Fragment>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-12">
              <h3 className="text-center text-info">New PostIt Post</h3>
              <form onSubmit={this.handleNewPost}>
                <div className="form-group">
                  <label htmlFor="metaMaskAccount">MetaMask Account:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="metaMaskAccount"
                    id="metaMaskAccount"
                    placeholder="0x1234567890987656"
                    value={accountAddress}
                    disabled/>
                </div>

                <div className="form-group">
                  <label for="title">Title:</label>
                  <input type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    placeholder="Title"
                    onChange={(event) => this.handleChange(event)}
                    value={this.state.title}
                    required />
                </div>

                <div className="form-group">
                  <label className="col-form-label">Content</label>
                </div>
                <div className="form-group">
                  <textarea
                    name="content"
                    id="content"
                    placeholder="Content text"
                    onChange={(event) => this.handleChange(event)}
                    value={this.state.content}
                    className='form-control'
                    maxLength={500}
                    />
                </div>
                
                <div className="form-group">
                  <button className="btn btn-info btn-md">Submit</button>
                </div>
              </form>
            </div>
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

export default connect(mapStateToProps)(NewPost);
