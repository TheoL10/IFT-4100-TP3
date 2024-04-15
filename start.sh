#!/bin/bash

npm install
truffle compile --all
cp build/contracts/VotingSystem.json src/VotingSystem.json
truffle migrate --network development
npm start