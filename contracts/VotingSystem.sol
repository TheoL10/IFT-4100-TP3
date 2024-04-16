// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VotingSystem {
    // Initialisation des variables
    address public owner;
    mapping(address => uint) public voterCounts;
    mapping(uint => uint) public votesReceived;
    string[] public proposalList;
    uint public votePrice = 0.1 ether;

    // Initialisation des évènements
    event ProposalAdded(string proposal);
    event VoteReceived(string proposal, address voter);

    // Constructeur
    constructor() public {
        owner = msg.sender;
        votePrice = 0.1 ether;
    }

    // Modifier pour réserver au propriétaire
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Ajouter une proposition
    function addProposal(string memory newProposal) public {
        // Pousse une proposition dans la liste et émet l'évènement proposition ajoutée
        proposalList.push(newProposal);
        emit ProposalAdded(newProposal);
    }

    // Voter pour une proposition
    function voteForProposal(uint proposal) public payable {
        // Vérifie que la proposition existe
        require(proposal < proposalList.length, "Invalid proposal");
        uint numVotes = voterCounts[msg.sender];

        // Vérifie que les fonds nécessaires sont présent
        require(msg.value >= votePrice, "Insufficient funds sent");

        // Incrémente les variables comptant les votes et les votants et émet l'évènement vote reçu
        votesReceived[proposal]++;
        voterCounts[msg.sender]++;
        emit VoteReceived(proposalList[proposal], msg.sender);

        if (msg.value >= votePrice) {
            // Réalise le transfert
            address payable sender = address(uint160(msg.sender));
            sender.transfer(msg.value - votePrice);
        }
    }

    // Retourne le nombre de vote pour une proposition
    function getVoteCount(uint proposal) public view returns (uint) {
        require(proposal < proposalList.length, "Invalid proposal");
        return votesReceived[proposal];
    }

    // Initialise le prix du vote
    function setInitialVotePrice(uint newPrice) public onlyOwner {
        votePrice = newPrice;
    }

    // Renvoi le nombre de proposition
    function getProposalListLength() public view returns (uint) {
        return proposalList.length;
    }
}
