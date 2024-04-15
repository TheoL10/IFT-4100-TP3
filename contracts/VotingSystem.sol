// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VotingSystem {
    address public owner;
    mapping(address => uint) public voterCounts; // Tracks number of votes per address
    mapping(uint => uint) public votesReceived;
    string[] public proposalList;
    uint public votePrice = 0.1 ether; // Initial cost to vote

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    event VoteReceived(string proposal, address voter);

    constructor() public {
        owner = msg.sender;
    }

    function addProposal(string memory newProposal) public onlyOwner {
        proposalList.push(newProposal);
    }

    // Function to allow voting, with the cost increasing exponentially with each additional vote
    function voteForProposal(uint proposal) public payable {
        require(proposal < proposalList.length, "Invalid proposal");
        uint numVotes = voterCounts[msg.sender];
        uint costForNextVote = votePrice * (2 ** numVotes); // Cost doubles each time

        require(msg.value >= costForNextVote, "Insufficient funds sent");

        voterCounts[msg.sender]++;
        votesReceived[proposal]++;
        emit VoteReceived(proposalList[proposal], msg.sender);

        // Refund any excess ether sent
        if (msg.value > costForNextVote) {
            address payable sender = address(uint160(msg.sender));
            sender.transfer(msg.value - costForNextVote);
        }
    }

    function getVoteCount(uint proposal) public view returns (uint) {
        require(proposal < proposalList.length, "Invalid proposal");
        return votesReceived[proposal];
    }

    function setInitialVotePrice(uint newPrice) public onlyOwner {
        votePrice = newPrice;
    }

    function donate() public payable {
        // Function to receive donations
    }
}
