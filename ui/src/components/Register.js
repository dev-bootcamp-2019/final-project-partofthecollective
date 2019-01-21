import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { notify } from '../utils/helpers';
import {
  callMethodEnroll,
  callMethodGetAllPosts,
} from '../utils/contractAPI';

import {
  setLastTransaction,
  getAllPostItPosts,
} from '../actions/ethContract';
import { setAuthedUser } from '../actions/authedUser';
import { defaults } from '../config/config';

const defaultState = {
  firstName: '',
  lastName: '',
  email: '',
};

class Register extends Component {
  state = defaultState;

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleRegister = (e) => {
    if (!e.target.checkValidity()) {
      return;
    }
    e.preventDefault();
    const { firstName, lastName, email } = this.state;
    const { history, accountAddress, ethContract } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    callMethodEnroll(ethContract.postItContract, firstName, lastName, email, accountAddress)
      .then((tx) => {
        if (tx && !tx.success && tx.message) {
          notify(tx.message.toString(), 'error');
          return;
        }
        this.props.dispatch(setAuthedUser({ firstName: firstName, lastName: lastName, email: email, accountAddress: accountAddress, avatarURL: defaults.defaultProfileImageURL }));
        this.props.dispatch(setLastTransaction(tx), notify(`You are now registered with blockHash: ${tx.receipt.blockHash.toString()}`, 'success'));
        return callMethodGetAllPosts(ethContract.postItContract, accountAddress);
      })
      .then((posts) => {
        if (posts) {
          this.props.dispatch(getAllPostItPosts(posts));
          if (from !== '/' || from !== '/login' || from !== '/register') {
            history.push(from);
          } else {
            history.push('/');
          }
        }
      })
      .catch((e) => {
         //console.log('error thrown', e);
         notify(e, 'error');
      });
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
              <h3 className="text-center text-info">Register</h3>
              <form onSubmit={this.handleRegister}>
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
                  <label for="firstName">First Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    id="firstName"
                    placeholder="Jack"
                    onChange={(event) => this.handleChange(event)}
                    value={this.state.firstName}
                    required />
                </div>

                <div className="form-group">
                  <label for="lastName">Last Name:</label>
                  <input type="text"
                    className="form-control"
                    name="lastName"
                    id="lastName"
                    placeholder="Black"
                    onChange={(event) => this.handleChange(event)}
                    value={this.state.lastName}
                    required />
                </div>

                <div className="form-group">
                  <label for="emailAddress">Email:</label>
                  <input type="email"
                    className="form-control"
                    name="email"
                    id="emailAddress"
                    placeholder="Email"
                    onChange={(event) => this.handleChange(event)}
                    value={this.state.email}
                    required />
                </div>
                
                <div className="form-group">
                  <button className="btn btn-info btn-md">Register</button>
                </div>
                <div className="form-group">
                  <NavLink to='/loging' activeClassName='active'>
                    Go to Login
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps({ authedUser,ethContract }) {
  return {
    authedUser,
    web3: ethContract.web3,
    accountAddress: ethContract.accountAddress,
    ethContract,
  };
}

export default connect(mapStateToProps)(Register);
