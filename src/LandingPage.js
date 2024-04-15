import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VoteComponent from './components/Vote.js';
import Web3 from 'web3';

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
          const contractAddress = '0x1d31Eb9bcaaEFf31243E11Dc8696Fd7F096504c7';
          const contractABI = [
            {
              "constant": true,
              "inputs": [],
              "name": "votePrice",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "name": "",
                  "type": "address"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "proposalList",
              "outputs": [
                {
                  "name": "",
                  "type": "string"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "voterCounts",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "votesReceived",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "name": "proposal",
                  "type": "string"
                }
              ],
              "name": "ProposalAdded",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "name": "proposal",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "name": "voter",
                  "type": "address"
                }
              ],
              "name": "VoteReceived",
              "type": "event"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "newProposal",
                  "type": "string"
                }
              ],
              "name": "addProposal",
              "outputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "proposal",
                  "type": "uint256"
                }
              ],
              "name": "voteForProposal",
              "outputs": [],
              "payable": true,
              "stateMutability": "payable",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [
                {
                  "name": "proposal",
                  "type": "uint256"
                }
              ],
              "name": "getVoteCount",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            },
            {
              "constant": false,
              "inputs": [
                {
                  "name": "newPrice",
                  "type": "uint256"
                }
              ],
              "name": "setInitialVotePrice",
              "outputs": [],
              "payable": false,
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "constant": true,
              "inputs": [],
              "name": "getProposalListLength",
              "outputs": [
                {
                  "name": "",
                  "type": "uint256"
                }
              ],
              "payable": false,
              "stateMutability": "view",
              "type": "function"
            }
          ];
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
