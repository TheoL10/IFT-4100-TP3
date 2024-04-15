import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VoteComponent from './components/Vote.js';
import Web3 from 'web3';
import VotingSystemJSON from './VotingSystem.json';

const networkId = '5777';
const networkInfo = VotingSystemJSON.networks[networkId];

// Affiche les liens accessibles à l'utilisateur
function LandingPage() {
  
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  React.useEffect(() => {
    async function loadBlockchainData() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          const contractAddress = networkInfo.address;
          const contractABI = VotingSystemJSON.abi;
          const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
          setWeb3(web3Instance);
          setContract(contractInstance);
        } catch (error) {
          console.error("Error enabling ethereum", error);
        }
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    loadBlockchainData();
  }, []);

  if (!web3 || !contract) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Bonjour les cryptos et tout</h1>
      <VoteComponent contract={contract} web3={web3}/>
    </div>
  );
}

export default LandingPage;
