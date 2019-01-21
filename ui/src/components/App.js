import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoadingBar from 'react-redux-loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  web3connect,
  getMetaMaskAccount,
  instantiatePostItContract,
} from '../actions/ethContract';

import Nav from './Nav';
import Login from './Login';
import Register from './Register';
import HomePage from './HomePage';
import NotFound from './NotFound';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const web3Instance = web3connect(dispatch);
    getMetaMaskAccount(dispatch, web3Instance);
    instantiatePostItContract(dispatch, web3Instance);
  }

  render() {
    return (
      <Router>
        <Fragment>
          <Nav />
          <LoadingBar />
          <div className='container'>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
            />
            <Switch>
              <Route path='/login' exact component={Login} />
              <Route path='/register' exact component={Register} />
              <Route path='/' component={HomePage} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    );
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

export default connect(mapStateToProps)(App);
