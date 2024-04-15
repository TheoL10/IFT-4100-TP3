// src/App.js
import React from 'react';
import VoteComponent from './components/Vote.js';
import Web3 from 'web3';

const fs = require('fs');
const App = () => {
    const contractAddress = '0x9aE02Be91aB2f4Bb43F84638B7FdA677DafB6B36';
    const contractABI =
      JSON.parse(fs.readFileSync('./build/contracts/VotingSystem.json', 'utf8'));
    const web3 = new Web3(window.ethereum || 'http://localhost:8545');
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-8">Voting App</h1>
            <VoteComponent contract={contract} />
        </div>
    );
};

export default App;
