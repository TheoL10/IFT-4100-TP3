// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VotingSystem {
    address public owner;
    mapping(address => uint) public voterCounts;
    mapping(uint => uint) public votesReceived;
    string[] public proposalList;
    uint public votePrice = 0.1 ether;

    event ProposalAdded(string proposal);
    event VoteReceived(string proposal, address voter);

    constructor() public {
        owner = msg.sender;
        votePrice = 0.1 ether;
    }

    // Allow only owner to perform some actions
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Allow any user to add proposals
    function addProposal(string memory newProposal) public {
        proposalList.push(newProposal);
        emit ProposalAdded(newProposal);
    }

    function voteForProposal(uint proposal) public payable {
        require(proposal < proposalList.length, "Invalid proposal");
        uint numVotes = voterCounts[msg.sender];

        require(msg.value >= votePrice, "Insufficient funds sent");

        votesReceived[proposal]++;
        voterCounts[msg.sender]++;
        emit VoteReceived(proposalList[proposal], msg.sender);

        if (msg.value >= votePrice) {
            address payable sender = address(uint160(msg.sender));
            sender.transfer(msg.value - votePrice);
        }
    }

    function getVoteCount(uint proposal) public view returns (uint) {
        require(proposal < proposalList.length, "Invalid proposal");
        return votesReceived[proposal];
    }

    function setInitialVotePrice(uint newPrice) public onlyOwner {
        votePrice = newPrice;
    }

    function getProposalListLength() public view returns (uint) {
        return proposalList.length;
    }
}
