// src/App.js
import React from 'react';
import VoteComponent from './components/Vote.js';
import Web3 from 'web3';

const fs = require('fs');
const App = () => {
    const contractAddress = '0x7419c0A8fbAd407C9b88AF63c885c1b173b8f739';
    const contractABI =
      JSON.parse(fs.readFileSync('./build/contracts/VotingSystem.json', 'utf8'));
    const web3 = new Web3(window.ethereum || 'http://127.0.0.1:7545');
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-8">Voting App</h1>
            <VoteComponent contract={contract} />
        </div>
    );
};

export default App;
