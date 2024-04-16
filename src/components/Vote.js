import React, { useState, useEffect } from 'react';

const VoteComponent = ({ contract, web3 }) => {
    // Initialisation des variables
    const [proposalList, setProposalList] = useState([]);
    const [selectedProposal, setSelectedProposal] = useState('');
    const [newProposal, setNewProposal] = useState('');
    const [account, setAccount] = useState('');

    // Récupère les données quand le contrat et web3 sont disponibles
    useEffect(() => {
        async function fetchData() {
            // Si le contrat n'est pas disponible quitte la fonction
            if (!contract) return;

            try {
                // Récupère la taille de la liste de proposition
                const listLength = await contract.methods.getProposalListLength().call();
                const proposals = [];
                // Parcours la liste de propositions
                for (let i = 0; i < listLength; i++) {
                    const proposal = await contract.methods.proposalList(i).call();
                    proposals.push(proposal);
                }
                // Met à jour la liste de proposition
                setProposalList(proposals);
                // Récupère le compte de l'utilisateur et le met à jour
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [contract, web3]);

    // Gère le vote
    const handleVote = async () => {
        console.log(selectedProposal);
        try {
            // Récupère le coût d'un vote
            const voteCost = web3.utils.toWei((0.1).toString(), 'ether');

            // Envoie la transaction pour voter au contrat
            const response = await contract.methods.voteForProposal(selectedProposal).send({
                from: account,
                value: voteCost,
                gas: 1000000
            });
            alert('Vote successful!');
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    // Gère l'ajout d'une proposition
    const handleAddProposal = async () => {
        try {
            // Envoi la propositon au contrat
            await contract.methods.addProposal(newProposal).send({ from: account });
            alert('Proposal added!');
            // Met à jour les propositions
            setNewProposal('');
            setProposalList([...proposalList, newProposal]);
        } catch (error) {
            console.error('Error adding proposal:', error);
        }
    };

    // Gère la récupération du nombre de vote pour une proposition
    const handleGetVoteCount = async () => {
        // Si aucune proposition n'est sélectionné quitte la fonction
        if (selectedProposal === '') {
            alert('No proposal selected');
            return;
        }

        try {
            // Récupère et affiche le nombre de vote
            const voteCount = await contract.methods.getVoteCount(selectedProposal).call();
            alert(`Proposal: ${selectedProposal}, number of votes: ${voteCount}`);
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
                        {index}: {proposal}
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
                            {index}: {proposal}
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