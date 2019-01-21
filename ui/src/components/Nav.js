import React, { Component, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Logout } from '../actions/authedUser';
import { navigation } from '../config/config';

class Nav extends Component {

  handleLogout = (event) => {
    if (event){
      this.props.dispatch(Logout());
    }
  }

  render() {
    const { authedUser } = this.props;
    return (
        <Fragment>
         <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">0xley</a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                {navigation.map((item) => {
                  return <li key={item.href}>
                    <NavLink to={item.href} exact activeClassName='active'>
                      {item.label}
                    </NavLink>
                  </li>
                })}
              </ul>
              <ul className="nav navbar-nav navbar-right">
              {authedUser ?
              <li>
                <img src={authedUser.avatarURL} className="img-circle" alt={`Avatar of ${authedUser.firstName} ${authedUser.lastName}`} width="50" />
              </li>
              : '' }
              {authedUser ?
              <li className="user-profile-name">
                Welcome {`${authedUser.firstName} ${authedUser.lastName}`}
              </li>
              : '' }
              {authedUser ?
              <li>
                <NavLink to='/login' activeClassName='active' onClick={(e) => this.handleLogout(e)}>
                  Logout
                </NavLink>
              </li>
              : '' }
              </ul>
            </div>
          </div>
        </nav>
      </Fragment>
    )
  }
}

function mapStateToProps ({ authedUser, ethContract }) {
  return {
    authedUser,
    web3: ethContract.web3,
    accountAddress: ethContract.accountAddress,
    ethContract,
    posts: ethContract.posts,
  };
}

export default withRouter(connect(mapStateToProps)(Nav));
