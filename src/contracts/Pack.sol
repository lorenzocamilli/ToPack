// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract Pack{

    struct Box {
        uint256 boxID;  
        address senderAddr; 
        address travellerAddr;
        address receiverAddr;
        uint256 shippingCost;
        uint256 boxValue;
    }


    uint256 currentBoxID;
    mapping(address => Box[]) public sentMap; // each user has associated the ID of all the box sent
    //mapping(address => uint256[]) public travellingMap; // each user has associated the IDs of all box he/she's trasferring
    //mapping(address => uint256[]) public receivedMap; // each user has associated the IDs of all the box received
    //mapping(address => uint256) public usersBalance; // map of balance of users


    function sendBox(
        address _senderAddr,
        address _travellerAddr,
        address _receiverAddr,
        uint256 _shippingCost,
        uint256 _boxValue
    ) public {
        //give the box to the traveller: block money trasferring them to the contract, add the box to each user
        Box memory newBox = Box({boxID: currentBoxID, senderAddr: _senderAddr, 
        travellerAddr: _travellerAddr, receiverAddr: _receiverAddr, shippingCost: _shippingCost, boxValue: _boxValue});
        sentMap[_senderAddr].push(newBox);
        currentBoxID = currentBoxID +1;
 
       // addressesArray.push(_senderAddr);
    }

    function getUserBox(address _senderAddr)  public view returns (Box[] memory ){
        // get the list of posts created by the msg.sender
        return  sentMap[_senderAddr];
    }
}