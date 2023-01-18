// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract Pack{

    struct Post{
        uint postID;   
        address postAuthor; 
        uint postPrice;
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

    function createPost(uint _postPrice) public{  
        // create a new post, insert the post in the array of posts of the sender 
        
        Post memory newPost = Post({postID: currentPostID, postAuthor: msg.sender,
        postPrice: _postPrice, postCreationTime: block.timestamp, deliverTime: 0 });
        postMap[msg.sender].push(newPost);

        currentPostID = currentPostID +1;   

        if (_postPrice  <= usersBalnce[msg.sender]){
            // check if the sender have enough money included the gas
            // transfer the money to the contract
            transfer(address(this), _postPrice); // address(this) address of the contract
        }
    }


    function getUserPosts() view public returns (Post[] memory ){
        // get the list of posts created by the msg.sender

        return  postMap[msg.sender];
    }


    function deletePost(uint _postID) public payable {
        // delete a post of the user, the post is selected by the postID 
        // if _postID is the ID of the last post in the array 
        if(_postID==(postMap[msg.sender][(postMap[msg.sender]).length-1].postID)) {
                transfer(msg.sender, postMap[msg.sender][(postMap[msg.sender]).length-1].postPrice); 
                postMap[msg.sender].pop(); 
        }
        // if _postID is the ID of the first (and only) post in the array
        else if ((postMap[msg.sender]).length==1 && _postID==postMap[msg.sender][0].postID){
                transfer(msg.sender, postMap[msg.sender][0].postPrice); 
                postMap[msg.sender].pop(); 
        } 

        else if ((postMap[msg.sender]).length!=1){   
            for (uint i = 0; i< (postMap[msg.sender]).length; i++){
                if (_postID==postMap[msg.sender][i].postID){
                    //gives back the money used to "create" the post to the sender (creator)
                    transfer(msg.sender, postMap[msg.sender][i].postPrice); 
                    // move the post to delete as last position of the array abd then poop it
                    postMap[msg.sender][i]=postMap[msg.sender][(postMap[msg.sender]).length-1]; 
                    postMap[msg.sender].pop();
                    break;
                }
            } 
        }
        // if the post with ID == _postId doesn't exists
        else{
            // the user hve to receive back the gas used to call this function
            // transfer(msg.sender,usedGas );  
            revert Message( "Value must be greater than 0");
        }
    }      


    function changeDeliveryTime(uint _postID, uint newDeliveryTime) public{
        // change the date and time of the selected (with the postID) post
        // NOTE: the date is in Epoch time form, it's must be taken from the frontend

        for (uint i = 0; i< (postMap[msg.sender]).length; i++){
            if (_postID==postMap[msg.sender][i].postID){
                postMap[msg.sender][i].deliverTime=newDeliveryTime;
                break;
            }
        }
    }


    function transfer(address receiver, uint amount) public payable{
        // used to transfer an amount of money to a specific address

        require(usersBalnce[msg.sender] >=amount);           
        require(usersBalnce[receiver] +amount >= usersBalnce[receiver]);
        usersBalnce[msg.sender] -=amount;                    
        usersBalnce[receiver] +=amount; 
    }

} 



