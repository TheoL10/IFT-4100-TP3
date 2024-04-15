import React, { useState, useEffect } from 'react';

const VoteComponent = ({ contract, web3 }) => {
    const [proposalList, setProposalList] = useState([]);
    const [selectedProposal, setSelectedProposal] = useState('');
    const [newProposal, setNewProposal] = useState('');
    const [account, setAccount] = useState('');

    useEffect(() => {
        async function fetchData() {
            if (!contract) return;

            try {
                const listLength = await contract.methods.getProposalListLength().call();
                const proposals = [];
                for (let i = 0; i < listLength; i++) {
                    const proposal = await contract.methods.proposalList(i).call();
                    proposals.push(proposal);
                }
                setProposalList(proposals);
                // Fetch accounts from web3 instance directly
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [contract, web3]);

    const handleVote = async () => {
        console.log(selectedProposal);
        try {
            const numVotes = await contract.methods.voterCounts(account).call();
            const voteCost = web3.utils.toWei((0.1).toString(), 'ether');

            const response = await contract.methods.voteForProposal(selectedProposal).send({
                from: account,
                value: voteCost,
                gas: 1000000 // You might adjust this value based on your needs
            });
            console.log(response);
            console.log('Vote successful!');
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleAddProposal = async () => {
        try {
            await contract.methods.addProposal(newProposal).send({ from: account });
            console.log('Proposal added!');
            setNewProposal('');
            setProposalList([...proposalList, newProposal]); // Update local state to reflect the new proposal
        } catch (error) {
            console.error('Error adding proposal:', error);
        }
    };

    const handleGetVoteCount = async () => {
        if (selectedProposal === '') {
            console.log('No proposal selected');
            return;
        }
        
        try {
            const voteCount = await contract.methods.getVoteCount(selectedProposal).call();
            console.log(`Votes for proposal ${selectedProposal}: ${voteCount}`);
            alert(`Votes for proposal ${selectedProposal}: ${voteCount}`);
        } catch (error) {
            console.error('Error fetching vote count:', error);
        }
    };
    
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Proposals:</h2>
            <ul className="mb-4">
                {proposalList.map((proposal, index) => (
                    <li key={index} className="mb-2">
                        {proposal}
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={newProposal}
                onChange={(e) => setNewProposal(e.target.value)}
                placeholder="Enter new proposal"
                className="border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <button
                onClick={handleAddProposal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Add Proposal
            </button>
            <h2 className="text-2xl font-bold mt-8 mb-4">Vote</h2>
            <div className="flex items-center mb-4">
                <label htmlFor="proposal" className="mr-2">Select Proposal:</label>
                <select
                    id="proposal"
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={selectedProposal}
                    onChange={(e) => setSelectedProposal(e.target.value)}
                >
                    <option value="">Select</option>
                    {proposalList.map((proposal, index) => (
                        <option key={index} value={index}>
                            {proposal}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleVote}
                disabled={!selectedProposal}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 ${!selectedProposal && 'opacity-50 cursor-not-allowed'}`}
            >
                Vote
            </button>
            <button
                onClick={handleGetVoteCount}
                disabled={!selectedProposal}
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${!selectedProposal && 'opacity-50 cursor-not-allowed'}`}
            >
                Get Vote Count
            </button>
        </div>
    );    
};

export default VoteComponent;