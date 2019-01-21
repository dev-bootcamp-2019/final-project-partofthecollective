import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { notify } from '../utils/helpers';
import { 
  callMethodIsEnrolled,
  callMethodGetAllPosts,
} from '../utils/contractAPI';
import { getAllPostItPosts } from '../actions/ethContract';
import { setAuthedUser } from '../actions/authedUser';
import { defaults } from '../config/config';

const defaultState = {
  email: '',
};

class Login extends Component {
  state = defaultState;

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleLogin = (e) => {
    if (!e.target.checkValidity()) {
      return;
    }
    e.preventDefault();
    const { email } = this.state;
    const { history, ethContract, accountAddress, dispatch } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    callMethodIsEnrolled(ethContract.postItContract, email, accountAddress)
      .then((response) => {
        console.log(response,(response && !response.success));
        if (response && !response.success) {
          notify(response.message.toString(), 'error');
        } else if (response && response.userProfile && response.userProfile.length > 0 && response.userProfile[2] === email) {
          dispatch(setAuthedUser({ firstName: response.userProfile[0], lastName: response.userProfile[1], email: response.userProfile[2], accountAddress: response.userProfile[3], avatarURL: defaults.defaultProfileImageURL }));
          notify(response.message.toString(), 'success');
        }
        return callMethodGetAllPosts(ethContract.postItContract, response.userProfile[3]);
      })
      .then((posts) => {
        if (posts) {
          dispatch(getAllPostItPosts(posts));
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
              <h3 className="text-center text-info">Login</h3>
              <form onSubmit={this.handleLogin}>
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
                  <button className="btn btn-info btn-md">Login</button>
                </div>
                <div className="form-group">
                  <NavLink to='/register' activeClassName='active'>
                    Create a account
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

function mapStateToProps({ authedUser, ethContract }) {
  return {
    authedUser,
    web3: ethContract.web3,
    accountAddress: ethContract.accountAddress,
    ethContract,
  };
}

export default connect(mapStateToProps)(Login);
