// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract Pack{

    struct Post{
        uint postID;   
        address postAuthor; 
        address senderAddress; / 
        uint shippingCost;
        uint packValue;
        // time are in Epoch time (number of seconds from 1 jannuary 1970)
        uint postCreationTime;  
        uint deliverTime;       // this have to been taken from the frontend, for the moment it's setted to 0
    }

    uint currentPostID;  
    mapping (address => Post[])  postMap;   // map of psot of all users
	mapping (address => uint) public usersBalnce; // map of balances of users


    constructor()  {
        usersBalnce[msg.sender]=address(msg.sender).balance;
    }

    error Message(string message); 

    function createPost(address _postAuthor, address _shippingCost, uint _packValue uint _shippingCost) public{  
        // create a new post, insert the post in the array of posts of the sender 
        
        Post memory newPost = Post({postID: currentPostID, postAuthor: _postAuthor, 
        senderAddress: _senderAddress, packValue: _packValue, shippingCost: _shippingCost, 
        postCreationTime: block.timestamp, deliverTime: 0 });
        postMap[_postAuthor].push(newPost);

        currentPostID = currentPostID +1;   
    }

    
   function getUserPosts(address user) view public returns (Post[] memory ){
        // get the list of posts created by the msg.sender

        return  postMap[user];
    }



    function transfer(address receiver, uint amount) public payable{
        // used to transfer an amount of money to a specific address

        require(usersBalnce[msg.sender] >=amount);           
        require(usersBalnce[receiver] +amount >= usersBalnce[receiver]);
        usersBalnce[msg.sender] -=amount;                    
        usersBalnce[receiver] +=amount; 
    }

} 




