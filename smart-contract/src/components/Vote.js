import React, { useState, useEffect } from 'react';

const VoteComponent = ({ contract }) => {
    const [proposalList, setProposalList] = useState([]);
    const [selectedProposal, setSelectedProposal] = useState('');
    const [account, setAccount] = useState('');

    useEffect(() => {
        async function fetchData() {
            const proposals = await contract.methods.proposalList().call();
            setProposalList(proposals);
            const accounts = await window.web3.eth.getAccounts();
            setAccount(accounts[0]);
        }
        fetchData();
    }, [contract]);

    const handleVote = async () => {
        try {
            await contract.methods.voteForProposal(selectedProposal).send({ from: account });
            console.log('Vote successful!');
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Proposals:</h2>
            <ul>
                {proposalList.map((proposal, index) => (
                    <li key={index}>{proposal}</li>
                ))}
            </ul>
            <h2 className="text-xl font-bold mt-8 mb-4">Vote</h2>
            <label className="mr-2">Select Proposal:</label>
            <select
                className="border border-gray-300 rounded-md px-2 py-1"
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
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={handleVote}
                disabled={!selectedProposal}
            >
                Vote
            </button>
        </div>
    );
};

export default VoteComponent;
