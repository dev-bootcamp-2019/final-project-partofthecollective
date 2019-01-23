pragma solidity ^0.5.0;


contract PostIt {

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

  struct Comment {
    uint256 postId;
    string commentBody;
    mapping (address => User) commenters;
  }

  uint256 postId;
  uint256 commentId;
  address public owner;

  event LogEnrolled(address accountAddress);
  event LogNewPostAdded(uint256 postId, string title, string fullName, address accountAddress);
  event LogUpVote(uint256 postId, string title, uint votes, string fullName, address accountAddress);
  event LogDownVote(uint256 postId, string title, uint votes, string fullName, address accountAddress);
  event LogComment(uint256 postId, uint256 commentId, string commentBody, string fullName, address accountAddress);

  modifier onlyOwner () { require (msg.sender == owner, "You are not the owner."); _;}
  modifier notPostAuthor (uint256 _postId) { require (posts[_postId].accountAddress != msg.sender, "You are the post author."); _;}
  modifier notEnrolled () { require (enrolled[msg.sender] != true, "You are already enrolled with this address."); _;}

  constructor() public {
    owner = msg.sender;
    postId = 1;
    commentId = 1;
  }

  //Add a check to make sure the address is not bound aleady
  function enroll(string memory firstName, string memory lastName, string memory email) notEnrolled() public returns (bool) {
    enrolled[msg.sender] = true;
    userProfiles[msg.sender] = User({firstName: firstName, lastName: lastName, email: email, accountAddress: msg.sender});
    emit LogEnrolled(msg.sender);
    return enrolled[msg.sender];
  }

  function getUserProfile() public view returns (string memory, string memory, string memory, address) {
    return (userProfiles[msg.sender].firstName, userProfiles[msg.sender].lastName, userProfiles[msg.sender].email, userProfiles[msg.sender].accountAddress);
  }

  function addPostIt(string memory title, string memory content, uint vote) public returns(bool) {
    posts[postId] = Post({title: title, content: content, votes: vote, author: string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)),  accountAddress: msg.sender});
    emit LogNewPostAdded(postId, title, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    postsIndexes.push(postId);
    postId = postId + 1;
    return true;
  }

  function getPost(uint256 _postId) public view returns(uint256, string memory, string memory, uint, string memory, address) {
    return(_postId, posts[_postId].title, posts[_postId].content, posts[_postId].votes, posts[_postId].author, posts[_postId].accountAddress);
  }

  function makeUpVote(uint256 _postId) notPostAuthor(_postId) public returns(address) {
    require(posts[_postId].upVoters[msg.sender].accountAddress != msg.sender, "user has already up voted.");
    posts[_postId].upVoters[msg.sender] = userProfiles[msg.sender];
    posts[_postId].votes = posts[_postId].votes + 1;
    emit LogUpVote(_postId, posts[_postId].title, posts[_postId].votes, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    upVotersIndexes.push(msg.sender);
    return msg.sender;
  }

  function makeDownVote(uint256 _postId) notPostAuthor(_postId) public returns(address) {
    require(posts[_postId].downVoters[msg.sender].accountAddress != msg.sender, "user has already up voted.");
    posts[_postId].upVoters[msg.sender] = userProfiles[msg.sender];
    posts[_postId].votes = posts[_postId].votes - 1;
    emit LogDownVote(_postId, posts[_postId].title, posts[_postId].votes, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    downVotersIndexes.push(msg.sender);
    return msg.sender;
  }

  function addComment(uint256 _postId, string memory commentBody) public returns(bool) {
    posts[postId].comments[commentId] = Comment({postId: _postId, commentBody: commentBody});
    posts[postId].comments[commentId].commenters[msg.sender] = userProfiles[msg.sender];
    emit LogComment(postId, commentId, commentBody, string(abi.encodePacked(userProfiles[msg.sender].firstName, " ", userProfiles[msg.sender].lastName)), msg.sender);
    commentsIndexes.push(commentId);
    commentId = commentId + 1;
    return true;
  }

  function getAllPosts() external view returns(uint256[] memory) {
    return postsIndexes;
  }

  function getAllUpVoters() external view returns(address[] memory) {
    return upVotersIndexes;
  }

  function getAllDownVoters() external view returns(address[] memory) {
    return downVotersIndexes;
  }

  function getAllComments() external view returns(uint256[] memory) {
    return commentsIndexes;
  }

  function() external {
    revert();
  }
}
