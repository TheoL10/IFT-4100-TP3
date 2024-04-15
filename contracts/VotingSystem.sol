// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VotingSystem {
    address public owner;
    mapping(address => bool) public voters;
    mapping(uint => uint) public votesReceived;
    string[] public proposalList;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    event VoteReceived(string proposal);

    constructor() public {
        owner = msg.sender;
    }

    function addProposal(string memory newProposal) public onlyOwner {
        proposalList.push(newProposal);
    }

    function voteForProposal(uint proposal) public {
        require(!voters[msg.sender], "Already voted");
        require(proposal < proposalList.length, "Invalid proposal");
        
        voters[msg.sender] = true;
        votesReceived[proposal]++;
        emit VoteReceived(proposalList[proposal]);
    }

    function getVoteCount(uint proposal) public view returns (uint) {
        require(proposal < proposalList.length, "Invalid proposal");
        return votesReceived[proposal];
    }

    function donate() public payable {
        // Fonction pour recevoir des dons
    }
}
