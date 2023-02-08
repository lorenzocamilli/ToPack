// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
@title ToPack - The new era of private, secure, and fast delivery
@dev Makes sure the payment takes place once the pack has been delivered
 */

contract Pack{

    /// @notice Structure of each shipping
    struct Box {
        uint256 boxID;  
        address senderAddr; 
        address travellerAddr;
        address receiverAddr;
        uint256 shippingCost;
        uint256 boxValue;
    }

    /// @notice Counter that acts as a unique identifier for each shipping
    uint256 currentBoxID;
    /// @notice Array that stores each shipping of a user as a sender
    mapping(address => Box[]) public sentMap;
    /// @notice Array that stores each shipping of a user as a traveller
    mapping(address => Box[]) public travelMap;
    /// @notice Array that stores all the shippings in process
    Box[] public boxes;    

    /**
    @notice Creation of the non-fungible token that works as a receipt
    @param _senderAddr Address of the sender
    @param _travellerAddr Address of the traveller
    @param _receiverAddr Address of the receiver
    @param _shippingCost Shipment cost
    @param _boxValue Pack value
     */
    function assignBox(
        address _senderAddr,
        address _travellerAddr,
        address _receiverAddr,
        uint256 _shippingCost,
        uint256 _boxValue
    ) public {
        // Temporary box created
        Box memory newBox = Box({boxID: currentBoxID, senderAddr: _senderAddr, 
            travellerAddr: _travellerAddr, receiverAddr: _receiverAddr, shippingCost: _shippingCost, boxValue: _boxValue});
        // Push of the shipping inside the respective mappings
        sentMap[_senderAddr].push(newBox);
        travelMap[_travellerAddr].push(newBox);
        boxes.push(newBox);
        // currentBoxID increased for the next shipping
        currentBoxID = currentBoxID +1;
    }

    /**
    @notice Retrieve the value of a pack
    @dev Used to lock the appropriate amount of money from the traveller
    @param _boxID ID that refers to the shipping
    @return _boxValue Value of the pack of the shipping
    */

    function getBoxValue(
        uint256 _boxID
        ) public view returns (uint256 _boxValue){
            uint value;
            for (uint256 i = 0; i < (boxes.length)-1; i++) {
                if (boxes[i].boxID==_boxID){
                    value= boxes[i].boxValue;
                    break;
                }
            }
        return value;
    }

    /**
    @notice List all the shippings assigned to the sender
    @param _senderAddr Address of the user
    @return se Shippings as a sender
     */

    function getSenderBoxes(address _senderAddr)  public view returns (Box[] memory ){
        // get the list of posts created by the msg.sender
        return  sentMap[_senderAddr];
    }
    
    /**
    @notice List all the shippings assigned to the traveller
    @param _travellerAddr Address of the user
    @return tr Shippings as a traveller
     */

    function getTravellerBoxes(address _travellerAddr)  public view returns (Box[] memory){
        // get the list of posts created by the msg.sender
        return  travelMap[_travellerAddr];
    }

    /**
    @notice Unlock the money that has been sent to the contract and pay the traveller
    @param _boxID ID that refers to the shipping
    */

    function boxReceived(uint _boxID) public{
        address sender;
        address traveller;
        // only the receiver can call this function to pay the traveller
        for (uint256 i = 0; i < boxes.length; i++) {
            if (boxes[i].boxID==_boxID){
                if (msg.sender == boxes[i].receiverAddr){
                    payable(boxes[_boxID].travellerAddr).transfer(boxes[_boxID].shippingCost);  //  paying for the shipping
                    payable(boxes[_boxID].travellerAddr).transfer(boxes[_boxID].boxValue);      //  giving back the box value
                  // paying the traveller from the smart contract, giving him back the boxValue too
      
                  // temporary aliases for the addresses
                    sender = boxes[_boxID].senderAddr;
                    traveller = boxes[_boxID].travellerAddr;  
                    // burn the nfts   
                   
                    break;
                }

            }
        }   
        burn2(sentMap[sender], _boxID);
        burn2(travelMap[traveller], _boxID);
        burn2(boxes, _boxID);
    }





    function burn2(Box[] storage boxesArray, uint _boxID ) private{   
        if (boxesArray.length != 1  && _boxID == (boxesArray[(boxesArray.length) - 1].boxID)) {
            boxesArray.pop();
        }else if (boxesArray.length == 1 && _boxID == boxesArray[0].boxID){            // if _boxID is the ID of the first (and the only) box in the array
            boxesArray.pop();
        } else if (boxesArray.length != 1){
            for (uint i = 0; i < boxesArray.length; i++) {
                if ( boxesArray[i].boxID==_boxID){
                    boxesArray[i] = boxesArray[boxesArray.length - 1];
                    boxesArray.pop();
                    break;
                }
            }
        }
    }
    

    /// @notice Money has been received by the contract
    event Received(address, uint);

    /// @notice Receive function used to receive ether
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}



 /*   function burn(address sender, uint256 _boxID, Box[]  ) private {
        // delete the box from the sender array
        // if the _boxID is the ID of the last item in the map, just pop it
       
        for (uint256 i = 0; i < (sentMap[sender]).length; i++) {
            if (_boxID == (sentMap[sender][(sentMap[sender]).length - 1].boxID)) {
                sentMap[sender].pop();
                break;
            } else if ((sentMap[sender]).length == 1 && _boxID == sentMap[sender][0].boxID){            // if _boxID is the ID of the first (and the only) box in the array
                sentMap[sender].pop();
                break;
            } else if ((sentMap[sender]).length != 1) {
            // move the element as last element of the array and then delete it
                if (_boxID == sentMap[sender][i].boxID) {
                    sentMap[sender][i] = sentMap[sender][
                        (sentMap[sender]).length - 1
                    ];
                    sentMap[sender].pop();
                    break;
                }
            }
        }
       for (uint256 i = 0; i < (travelMap[traveller]).length; i++) {
            if (_boxID == (travelMap[traveller][(travelMap[traveller]).length - 1].boxID)) {
                travelMap[traveller].pop();
                break;
            } else if ((travelMap[traveller]).length == 1 && _boxID == travelMap[traveller][0].boxID){            // if _boxID is the ID of the first (and the only) box in the array
                travelMap[traveller].pop();
                break;
            } else if ((travelMap[traveller]).length != 1) {
            // move the element as last element of the array and then delete it
                if (_boxID == travelMap[traveller][i].boxID) {
                    travelMap[traveller][i] = travelMap[traveller][
                        (travelMap[traveller]).length - 1
                    ];
                    travelMap[traveller].pop();
                    break;
                }
            }     
        }
        for (uint256 i = 0; i < boxes.length; i++) {
            if (_boxID == (boxes[boxes.length - 1].boxID)) {
                boxes.pop();
                break;
            } else if (boxes.length == 1 && _boxID == boxes[i].boxID){            // if _boxID is the ID of the first (and the only) box in the array
                boxes.pop();
                break;
            } else if (boxes.length != 1){
                if (_boxID == boxes[i].boxID) {
                    boxes[i] = boxes[boxes.length - 1];
                    boxes.pop();
                    break;
                }
            }
        }
    }
    */