import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';

import Post from './Post';

const Dashboard = (props) => {
  const { authedUser, ethContract, dispatch, posts } = props;
  const sortedPosts = Object.values(posts).sort((a,b) => b.votes - a.votes);
  return (
    <div>
      {authedUser ?
        <Fragment>
          <div className="container">
            <h3 className="text-info">Posts</h3>
            <ul className="media-list">
            {sortedPosts && sortedPosts.length > 0 ?
              posts.map((post, i) => <Post
                                        key={i}
                                        {...props}
                                        authedUser={authedUser}
                                        ethContract={ethContract}
                                        dispatch={dispatch}
                                        postId={post.postId}
                                        title={post.title}
                                        content={post.content}
                                        votes={post.votes}
                                        author={post.author}
                                        authorAddress={post.accountAddress}
                                      />)
              : <li>There are not posts.</li>
            }
          </ul>
          </div>
        </Fragment>
        :
        <Redirect to='/login' />
      }
    </div>
  );
}

export default (Dashboard);
