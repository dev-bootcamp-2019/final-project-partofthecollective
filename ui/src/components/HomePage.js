import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getAllPostItPosts,
} from '../actions/ethContract';

import {
  callMethodGetAllPosts,
} from '../utils/contractAPI';

import Dashboard from './Dashboard';
import NewPost from './NewPost';
import PostDetails from './PostDetails';
import NotFound from './NotFound';

class HomePage extends Component {
  state = {
    loaded: false,
  }

  componentDidUpdate() {
    const { authedUser, ethContract, accountAddress, dispatch } = this.props;
    const userAddress = (accountAddress) ? accountAddress : authedUser.accountAddress;
    if (!this.state.loaded) {
      callMethodGetAllPosts(ethContract.postItContract, userAddress)
        .then((posts) => {
          if (posts) {
            dispatch(getAllPostItPosts(posts));
            this.setState({ loaded: true });
          }
        });
    }
  }

  render() {
    //move this block to top level component
    const { web3, authedUser, ethContract, dispatch, posts  } = this.props;
    if (!web3) {
      return (
        <div>Loading MetaMask...</div>
      );
    }
    return (
      <div>
        {authedUser ?
          <Fragment>
            <Switch>
              <Route path='/add' exact component={NewPost} />
              {/*post details route work in progress, but not enough time to complete*/}
              {/*<Route path='/posts/:post_id' component={PostDetails} />*/}
              <Route path='/' exact render={(props) => <Dashboard {...props} authedUser={authedUser} ethContract={ethContract} dispatch={dispatch}  posts={posts} />} />
              <Route path='/404' exact component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </Fragment>
          :
          <Redirect to={{ pathname: '/login', state: { from: this.props.location }} }/>
      }
      </div>
    )
  }
}

function mapStateToProps({ authedUser, ethContract }) {
  return {
    authedUser,
    web3: ethContract.web3,
    accountAddress: ethContract.accountAddress,
    ethContract,
    posts: ethContract.posts,
    post: ethContract.post,
  };
}

export default connect(mapStateToProps)(HomePage);
