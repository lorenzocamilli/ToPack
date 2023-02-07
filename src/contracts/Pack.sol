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

    constructor()  {
        minter = payable(msg.sender);         // saving the minter address
    }

    uint256 currentBoxID;
    mapping(address => Box[]) public sentMap; // each user has associated the ID of all the box sent
    mapping(address => Box[]) public travelMap; // each user has associated the ID of all the box sent
    mapping (uint256 => Box) public boxes;    // map of all posts
    address payable minter;                   // minter addr for the withdraw

    function assignBox(
        address _senderAddr,
        address _travellerAddr,
        address _receiverAddr,
        uint256 _shippingCost,
        uint256 _boxValue
    ) public {
        // CHECKS DONE IN WEB3
        
        //give the box to the traveller: block money trasferring them to the contract, add the box to each user
        Box memory newBox = Box({boxID: currentBoxID, senderAddr: _senderAddr, 
            travellerAddr: _travellerAddr, receiverAddr: _receiverAddr, shippingCost: _shippingCost, boxValue: _boxValue});
        sentMap[_senderAddr].push(newBox);
        travelMap[_travellerAddr].push(newBox);
        boxes[currentBoxID] = newBox;
        currentBoxID = currentBoxID +1;    
    }

    function deliverBox(
        uint256 _boxID
        ) public view returns (uint256 _boxValue){
        return boxes[_boxID].boxValue;
    }

    function getUserBox(address _senderAddr)  public view returns (Box[] memory ){
        // get the list of posts created by the msg.sender
        return  sentMap[_senderAddr];
    }
    
    function getTravellerBoxes(address _travellerAddr)  public view returns (Box[] memory ){
        // get the list of posts created by the msg.sender
        return  travelMap[_travellerAddr];
    }

    function BoxDelivered(uint _boxID) public{
        // pack has been delivered -> pay the traveller

        // only the receiver can call this function to pay the traveller
        require(msg.sender == boxes[_boxID].receiverAddr);

        // paying the traveller from the smart contract, giving him back the boxValue too
        payable(boxes[_boxID].travellerAddr).transfer(boxes[_boxID].shippingCost);  //  paying for the shipping
        payable(boxes[_boxID].travellerAddr).transfer(boxes[_boxID].boxValue);      //  giving back the box value

        // changing the post state to delivered
           // changing the post state to delivered
           address sender = boxes[_boxID].senderAddr;
           address traveller = boxes[_boxID].travellerAddr;      
           burn(sender,traveller, _boxID);
       }
   
       function burn(address sender, address traveller, uint256 _boxID) private {
        if (sender == boxes[_boxID].senderAddr) {
            if (_boxID == (sentMap[sender][(sentMap[sender]).length - 1].boxID)) {
                sentMap[sender].pop();
            }
            // if _boxID is the ID of the first (and only) post in the array
            else if (
                (sentMap[sender]).length == 1 && _boxID == sentMap[sender][0].boxID
            ) {
                sentMap[sender].pop();
            } else if ((sentMap[sender]).length != 1) {
                for (uint256 i = 0; i < (sentMap[sender]).length; i++) {
                    if (_boxID == sentMap[sender][i].boxID) {
                        sentMap[sender][i] = sentMap[sender][
                            (sentMap[sender]).length - 1
                        ];
                        sentMap[sender].pop();
                        break;
                    }
                }
            }
        }
        if (traveller == boxes[_boxID].travellerAddr) {
            if (
                _boxID == (travelMap[traveller][(travelMap[traveller]).length - 1].boxID)
            ) {
                travelMap[traveller].pop();
            } else if (
                (travelMap[traveller]).length == 1 &&
                _boxID == travelMap[traveller][0].boxID
            ) {
                travelMap[traveller].pop();
            } else if ((travelMap[traveller]).length != 1) {
                for (uint256 i = 0; i < (travelMap[traveller]).length; i++) {
                    if (_boxID == travelMap[traveller][i].boxID) {
                        travelMap[traveller][i] = travelMap[traveller][
                            (travelMap[traveller]).length - 1
                        ];
                        travelMap[traveller].pop();
                        break;
                    }
                }
            }
        }
        for (uint i = 0; i < currentBoxID; i ++){
            if(_boxID==boxes[i].boxID){
                delete boxes[i];
                break;
            }
        }
    }
   
    event Received(address, uint);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
