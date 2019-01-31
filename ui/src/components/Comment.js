import React, { Fragment } from 'react';
import { tipAuthor } from '../utils/helpers';

const Comment = (props) => {

  const { authedUser, ethContract, commentBody, commentAuthor, commentFromAddress } = props;
  return (
    <Fragment>
      <div className="comment">
        <div className="comment-body">{commentBody}</div>
        <div className="comment-author">made by: {commentAuthor}</div>
        <div className="comment-tip">
          <span className="glyphicon glyphicon-piggy-bank" aria-hidden="true" alt="tip author" onClick={(e) => tipAuthor(ethContract.web3, authedUser.accountAddress, commentFromAddress)}></span>
        </div>
      </div>
    </Fragment>
  );
};

export default (Comment);
