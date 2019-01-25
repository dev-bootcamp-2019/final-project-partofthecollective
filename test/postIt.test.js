const PostIt = artifacts.require("./PostIt.sol");

function generateUID() {
  return Math.random().toString().substring(2, 15) + Math.random().toString().substring(2, 15);
}

contract('PostIt', function(accounts) {

  const owner = accounts[0]
  const account1 = accounts[1];
  const account2 = accounts[2];

  const fName1 = 'Fname1';
  const lName1 = 'Lname1';
  const email1 = 'testEmail1@test.com';

  const fName2 = 'Fname2';
  const lName2 = 'Lname2';
  const email2 = 'testEmail2@test.com';

  const postTitle = 'PostTitle1';
  const postContent = "Lorem ipsum tortor dolor malesuada rhoncus pellentesque orci nisl, at cras torquent sapien nam ad ligula, condimentum interdum sapien ipsum hac dictumst sociosqu. Sed pulvinar accumsan tristique justo vel netus nibh, feugiat mauris rhoncus nostra duis proin praesent nisi, porta rhoncus tellus accumsan ac integer. Luctus mauris porta sit non cursus laoreet duis quisque aliquam morbi pretium, tempus litora maecenas potenti facilisis pretium quis hendrerit egestas himenaeos. Risus mauris scelerisque pharetra hac a ligula aenean, mollis molestie nunc consectetur hac aliquam luctus, sociosqu blandit nec inceptos est primis.Pulvinar aliquam odio tellus iaculis ipsum tellus sagittis lorem, mauris vestibulum sem vitae enim pulvinar magna mi eu, quisque inceptos vestibulum cubilia nisl facilisis quisque.";
  const vote = 1;
  const authorName = `${fName1} ${lName1}`;
  const commentBody = 'This is a test comment to a post.';

  let postId;
  let commentId;


  /**
   * Tests to test enrollment.
   */
  it("mark addresses as enrolled", async () => {
    const postIt = await PostIt.deployed();

    await postIt.enroll(fName1, lName1, email1, {from: account1});
    await postIt.enroll(fName2, lName2, email2, {from: account2});

    const account1Enrolled = await postIt.enrolled(account1, {from: account1});
    assert.equal(account1Enrolled, true, 'enroll account, check enroll method method or the constructor');

    const ownerEnrolled = await postIt.enrolled(owner, {from: owner});
    assert.equal(ownerEnrolled, false, 'only enrolled users should be marked enrolled');
  });


  /**
   * Tests for getting a user profile.
   */
  it("match stored user profile", async () => {
    const postIt = await PostIt.deployed();

    getUser = await postIt.getUserProfile({from: account1});
    assert.equal(getUser[0], fName1, 'the user first name does not appear to match.');
    assert.equal(getUser[1], lName1, 'the user last name does not appear to match.');
    assert.equal(getUser[2], email1, 'the user email does not appear to match.');
    assert.equal(getUser[3], account1, 'the user account address does not appear to match.');

    getUser = await postIt.getUserProfile({from: account2});
    assert.equal(getUser[0], fName2, 'the user first name does not appear to match.');
    assert.equal(getUser[1], lName2, 'the user last name does not appear to match.');
    assert.equal(getUser[2], email2, 'the user email does not appear to match.');
    assert.equal(getUser[3], account2, 'the user account address does not appear to match.');
  });

  /**
   * Tests to add a new PostIt post.
   */
  it("should be able to add a post", async () => {
    const postIt = await PostIt.deployed();

    const postAdded = await postIt.addPostIt(postTitle, postContent, vote, {from: account1});
    let eventEmitted = false;

    if (postAdded.logs[0].event === "LogNewPostAdded") {
      postId = postAdded.logs[0].args.postId.toString(10);
      eventEmitted = true;
    }

    assert.equal(eventEmitted, true, 'the new post added event was not emitted.');
  });


  /**
   * Tests to vote up a post.
   */
  it("should be able to up vote a post", async () => {
    const postIt = await PostIt.deployed();

    const postItUpVote = await postIt.makeUpVote(postId, {from: account2});
    if (postItUpVote.logs[0].event === "LogUpVote") {
      accountAddress = postItUpVote.logs[0].args.accountAddress.toString(10);
      upVotesCount = postItUpVote.logs[0].args.votes.toString(10);
      eventEmitted = true;
    }
    assert.equal(accountAddress, account2, 'you were able to make an up vote to a post.');
    assert.equal(upVotesCount, vote+1, 'you were able to make an up vote to a post.');
    assert.equal(eventEmitted, true, 'the post up vote event was not emitted.');
  });

  /**
   * Tests to vote down a post.
   */
  it("should be able to down vote a post", async () => {
    const postIt = await PostIt.deployed();

    const postItUpVote = await postIt.makeDownVote(postId, {from: account2});
    if (postItUpVote.logs[0].event === "LogDownVote") {
      accountAddress = postItUpVote.logs[0].args.accountAddress.toString(10);
      upVotesCount = postItUpVote.logs[0].args.votes.toString(10);
      eventEmitted = true;
    }
    assert.equal(accountAddress, account2, 'you were able to make a down vote to a post.');
    assert.equal(upVotesCount, vote, 'you were able to make a down vote to a post.');
    assert.equal(eventEmitted, true, 'the post down vote event was not emitted.');
  });

  /**
   * Tests to get a post by it's postId.
   */
  it("should get a post by id", async () => {
    const postIt = await PostIt.deployed();
    const result = await postIt.getPost(postId);

    assert.equal(result[0], postId, 'the post id did not match.');
    assert.equal(result[1], postTitle, 'the post title did not match.');
    assert.equal(result[2], postContent, 'the post content did not match.');
    assert.equal(result[3], vote, 'the post votes did not match.');
    assert.equal(result[4], authorName, 'the post votes did not match.');
    assert.equal(result[5], account1, 'the post author address did not match.');
  });

  /**
   * Test to get all the posts.
   */
  it("should get all posts", async () => {
    const postIt = await PostIt.deployed();

    const allPosts = await postIt.getAllPosts({from: account1});
    const hasPosts = allPosts.length > 0;
    assert.equal(hasPosts, true, 'there appears to be no posts created?');
  });

  /**
   * Tests to get all indexed up votes.
   */
  it("should get all up voters", async () => {
    const postIt = await PostIt.deployed();

    const allUpVoters = await postIt.getAllUpVoters({from: account1});
    const hasUpVotes = allUpVoters.length > 0;
    assert.equal(hasUpVotes, true, 'there appears to be no posts created?');
  });

  /**
   * Tests to get all indexed down voters.
   */
  it("should get all down voters", async () => {
    const postIt = await PostIt.deployed();

    const allDownVoters = await postIt.getAllDownVoters({from: account1});
    const hasDownVotes = allDownVoters.length > 0;
    assert.equal(hasDownVotes, true, 'there appears to be no posts created?');
  });

  /**
   * Test to make a comment on a post.
   */
  it("should make a comment to a post", async () => {
    const postIt = await PostIt.deployed();

    const commentAdded = await postIt.addComment(postId, commentBody, {from: account1});
    let eventEmitted = false;

    if (commentAdded.logs[0].event === "LogComment") {
      commentId = commentAdded.logs[0].args.commentId.toString(10);
      commentAddedBody = commentAdded.logs[0].args.commentBody.toString(10);
      eventEmitted = true;
    }

    assert.equal(commentAddedBody, commentBody, 'the new comment body did not match.');
    assert.equal(eventEmitted, true, 'the new comment event was not emitted.');
  });
});
