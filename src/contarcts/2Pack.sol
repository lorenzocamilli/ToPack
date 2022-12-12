// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract Pack{

    struct Post{
        uint postID;   
        address postAuthor; 
        uint postPrice;
        uint postCreationTime;  // this is in Epoch time, number of seconds from 1 jannuary 1970
        uint deliverTime;       // this have to been taken by the frontend
    }

    uint public currentPostID;
    mapping (address => Post[])  postMap;


    function createPost(uint _postPrice) public{  
        Post memory newPost = Post({postID: currentPostID, postAuthor: msg.sender,
        postPrice: _postPrice,   postCreationTime: block.timestamp, deliverTime: 0 });
        postMap[msg.sender].push(newPost);
        currentPostID = currentPostID +1;   
    }


    function getUserPosts() view public returns (Post[] memory ){
        // get the list of post created by the msg.sender
        return  postMap[msg.sender];
    }


    function deletePost(uint _postID) public{
        for (uint i = 0; i< (postMap[msg.sender]).length; i++){
            if (_postID==postMap[msg.sender][i].postID){
                postMap[msg.sender][i]=postMap[msg.sender][(postMap[msg.sender]).length-1];
                postMap[msg.sender].pop(); 
                break;
            }
        }  
    }      

    function changePrice(uint _postID, uint newPostPrice) public{
        // check if the id in iput exist, may not exist because the most can be deleted            
        for (uint i = 0; i< (postMap[msg.sender]).length; i++){
            if (_postID==postMap[msg.sender][i].postID){
                postMap[msg.sender][i].postPrice=newPostPrice;
                break;
            }
        }
    }


} 




