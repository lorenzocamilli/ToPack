// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Pack{

    enum BoxState {Assigned, Delivered}

    struct Box {
        uint256 boxID;  
        address senderAddr; 
        address travellerAddr;
        address receiverAddr;
        uint256 shippingCost;
        uint256 boxValue;
        BoxState state;  
    }

    constructor()  {
        minter = payable(msg.sender);         // saving the contract address
    }

    uint256 currentBoxID;
    mapping(address => Box[]) public sentMap; // each user has associated the ID of all the box sent
    mapping (uint256 => Box) public boxes;    // map of all posts
    address payable minter;                   // minter addr for the withdraw

    // deposit ether inside the smart contract
    function deposit() payable public {
    }

    // withdraw the money back from the contract
    function withdraw() public {
        require(msg.sender == minter);
        minter.transfer(address(this).balance);
    }

    function assignBox(
        address _senderAddr,
        address _travellerAddr,
        address _receiverAddr,
        uint256 _shippingCost,
        uint256 _boxValue
    ) public {
        // CHECKS DONE IN WEB3
        // checking the balances before the completion of the assignment
        
        // does the sender have enough money for the shipping?
        //require(_senderAddr.balance >= _shippingCost);
        // does the traveller have enough money to cover for the value of the box in case of theft?
        //require(_travellerAddr.balance >= _boxValue); 

        //give the box to the traveller: block money trasferring them to the contract, add the box to each user
        Box memory newBox = Box({boxID: currentBoxID, senderAddr: _senderAddr, 
            travellerAddr: _travellerAddr, receiverAddr: _receiverAddr, shippingCost: _shippingCost, boxValue: _boxValue,
            state: BoxState.Assigned});
        sentMap[_senderAddr].push(newBox);
        currentBoxID = currentBoxID +1;
        boxes[currentBoxID] = newBox;              

        // here we also lock the money of the users and store them in our contract
    }

    function getUserBox(address _senderAddr)  public view returns (Box[] memory ){
        // get the list of posts created by the msg.sender
        return  sentMap[_senderAddr];
    }

    function BoxDelivered(uint _boxID) public{
        // pack has been delivered -> pay the traveller

        // only the receiver can call this function to pay the traveller
        require(msg.sender == boxes[_boxID].receiverAddr);

        // paying the traveller from the smart contract, giving him back the boxValue too
        payable(boxes[_boxID].travellerAddr).transfer(boxes[_boxID].shippingCost);  //  paying for the shipping
        payable(boxes[_boxID].travellerAddr).transfer(boxes[_boxID].boxValue);      //  giving back the box value

        // changing the post state to delivered
        boxes[_boxID].state = BoxState.Delivered;
    }

    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}