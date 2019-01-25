pragma solidity ^0.5.0;

/** @title PostIt. */
contract PostIt {
/**
  * Variable declarations
  */

  mapping (address => bool) public enrolled;
  mapping (address => User) public userProfiles;
  mapping (uint256 => Post) public posts;

  uint256[] public postsIndexes;
  address[] public upVotersIndexes;
  address[] public downVotersIndexes;
  uint256[] public commentsIndexes;

  struct User {
    string firstName;
    string lastName;
    string email;
    address payable accountAddress;
  }

// struct Post
  struct Post {
    string title;
    string content;
    uint votes;
    string author;
    address payable accountAddress;
    mapping (address => User) upVoters;
    mapping (address => User) downVoters;
    mapping (uint256 => Comment) comments;
  }

// struct Comment
  struct Comment {
    uint256 postId;
    string commentBody;
    mapping (address => User) commenters;
  }

  uint256 postId;
  uint256 commentId;
  address public owner;

  // Event logging
  event LogEnrolled(address accountAddress);
  event LogNewPostAdded(uint256 postId, string title, string fullName, address accountAddress);
  event LogUpVote(uint256 postId, string title, uint votes, string fullName, address accountAddress);
  event LogDownVote(uint256 postId, string title, uint votes, string fullName, address accountAddress);
  event LogComment(uint256 postId, uint256 commentId, string commentBody, string fullName, address accountAddress);

  // modifiers
  modifier onlyOwner () { require (msg.sender == owner, "You are not the owner."); _;}
  modifier notPostAuthor (uint256 _postId) { require (posts[_postId].accountAddress != msg.sender, "You are the post author."); _;}
  modifier notEnrolled () { require (enrolled[msg.sender] != true, "You are already enrolled with this address."); _;}

  constructor() public {
    owner = msg.sender;
    postId = 1;
    commentId = 1;
  }

  /** @dev Enrolls a user profile and their account address.
    * @param firstName of the User.
    * @param lastName of the User.
    * @param email of the User.
    * @return a bool.
    */
  function enroll(string memory firstName, string memory lastName, string memory email) notEnrolled() public returns (bool) {
    enrolled[msg.sender] = true;
    userProfiles[msg.sender] = User({firstName: firstName, lastName: lastName, email: email, accountAddress: msg.sender});
    emit LogEnrolled(msg.sender);
    return enrolled[msg.sender];
  }

  /** @dev Get a user profile and their account address.
    * @return a array of firstName, lastName and email of a User.
    */
  function getUserProfile() public view returns (string memory, string memory, string memory, address) {
    return (userProfiles[msg.sender].firstName, userProfiles[msg.sender].lastName, userProfiles[msg.sender].email, userProfiles[msg.sender].accountAddress);
  }

  /** @dev Add a post.
    * @param title of a Post.
    * @param content of a Post.
    * @param default vote of a Post.
    * @return a bool.
    */
  function addPostIt(string memory title, string memory content, uint vote) public returns(bool) {
    posts[postId] = Post({title: title, content: content, votes: vote, author: string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)),  accountAddress: msg.sender});
    emit LogNewPostAdded(postId, title, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    postsIndexes.push(postId);
    postId = postId + 1;
    return true;
  }

  /** @dev Get a post.
    * @param postId of a Post.
    * @return a array with postId, title, content, votes, author, accountAddress (of author).
    */
  function getPost(uint256 _postId) public view returns(uint256, string memory, string memory, uint, string memory, address) {
    return(_postId, posts[_postId].title, posts[_postId].content, posts[_postId].votes, posts[_postId].author, posts[_postId].accountAddress);
  }

  /** @dev Vote up a post, if you're not the author.
    * @param postId of a Post.
    * @return a address of the user.
    */
  function makeUpVote(uint256 _postId) notPostAuthor(_postId) public returns(address) {
    require(posts[_postId].upVoters[msg.sender].accountAddress != msg.sender, "user has already up voted.");
    posts[_postId].upVoters[msg.sender] = userProfiles[msg.sender];
    posts[_postId].votes = posts[_postId].votes + 1;
    emit LogUpVote(_postId, posts[_postId].title, posts[_postId].votes, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    upVotersIndexes.push(msg.sender);
    return msg.sender;
  }

  /** @dev Vote down a post, if you're not the author.
    * @param postId of a Post.
    * @return a address of the user.
    */
  function makeDownVote(uint256 _postId) notPostAuthor(_postId) public returns(address) {
    require(posts[_postId].downVoters[msg.sender].accountAddress != msg.sender, "user has already up voted.");
    posts[_postId].upVoters[msg.sender] = userProfiles[msg.sender];
    posts[_postId].votes = posts[_postId].votes - 1;
    emit LogDownVote(_postId, posts[_postId].title, posts[_postId].votes, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    downVotersIndexes.push(msg.sender);
    return msg.sender;
  }

  /** @dev Add a comment to a post.
    * @param postId of a Post.
    * @param commentBody of the comment.
    * @return a bool.
    */
  function addComment(uint256 _postId, string memory commentBody) public returns(bool) {
    posts[postId].comments[commentId] = Comment({postId: _postId, commentBody: commentBody});
    posts[postId].comments[commentId].commenters[msg.sender] = userProfiles[msg.sender];
    emit LogComment(postId, commentId, commentBody, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    commentsIndexes.push(commentId);
    commentId = commentId + 1;
    return true;
  }

  /** @dev Get all post indexed.
    * @return a array of postIndexes.
    */
  function getAllPosts() external view returns(uint256[] memory) {
    return postsIndexes;
  }

  /** @dev Get all up voters indexed.
    * @return a array of upVotersIndexes.
    */
  function getAllUpVoters() external view returns(address[] memory) {
    return upVotersIndexes;
  }

  /** @dev Get all down voters indexed.
    * @return a array of downVotersIndexes.
    */
  function getAllDownVoters() external view returns(address[] memory) {
    return downVotersIndexes;
  }

  /** @dev Get all comments indexed.
    * @return a array of commentsIndexes.
    */
  function getAllComments() external view returns(uint256[] memory) {
    return commentsIndexes;
  }

  /** @dev Fallback revert method.
    */
  function() external {
    revert();
  }
}
