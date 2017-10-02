pragma solidity ^0.4.0;

contract Bidding {
    uint maxBid;
    address winner;
    
    uint baseBid;
    address owner; 
    string title;
    string description;
 
    event ShowMax (uint max,address hero);
    event AnnounceWinner (uint max, address hero);
     
    function Bidding(uint bidValue,string _title,string _description) {
        owner = msg.sender;
        baseBid = bidValue;
        title = _title;
        description = _description;
    }

    function getTitle() returns(string) {
        return title;
    }

    function putBid(uint newBid) returns (uint) {
        
        require(newBid > maxBid);
        maxBid = newBid;
        winner = msg.sender;
        ShowMax(maxBid,winner);
        return maxBid;
    }
    function getBid()returns(uint) {
        return maxBid;
    }
    
    function endBidding() {
        require(msg.sender == owner);
        AnnounceWinner(maxBid,winner);
        selfdestruct(owner);
    }
}