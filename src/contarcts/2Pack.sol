// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract Pack{

    struct Post{
        uint postID;   
        address postAuthor; 
        uint postPrice;
    //  uint postCreationTime;
    // delivertime
    }


//    Post[] public userPostArray;
    uint public currentPostID=0;
    mapping (address => Post[]) public postMap;


    function createPost(uint _postPrice) public{  
        Post memory newPost = Post({postID: currentPostID, postAuthor: msg.sender, postPrice: _postPrice});
    postMap[msg.sender].push(newPost);
    }

    function getUserPosts() view public returns (Post[] memory ){
        // get the list of post created by the msg.sender
        return  postMap[msg.sender];
    }


    function remeovePost(uint _postID) public{

        if (_postID >= (postMap[msg.sender]).length) return;
       postMap[msg.sender][_postID]= postMap[msg.sender][(postMap[msg.sender]).length-1];   // move the post with _postID in last position
    postMap[msg.sender].pop();  //remove the last element of the post of msg.sender (the one selected by _postID and moved in last position
}


} 




