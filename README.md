# ToPack

Project for the Blockchain and Distributed Ledger Technologies (A.Y. 2022-2023). The aim is to create a blockchain based decentralized app using [Solidity](https://soliditylang.org/).

ToPack have the purpose to help the people to deliver packs in a secure and not expensive way. In fact an user can create a post with a pack to send, an other user can accept to deliver the pack and propose itself as delivery. When a delivery man completes the shipment on time, he will receive the prizes offered by the post, otherwise he will receive a penalty for each day of delay or for having lost the package.
Any step is guaranteed by the blockchain.

## Requirements
- Solidity
- An IDE for Solidity, a good choice is [Remix IDE](https://remix-project.org/) or VSCode
- [NodeJS](https://trufflesuite.com/ganache/) and the following libraries: `web3js`, `jquerry`, `http-server`
- [Ganache](https://trufflesuite.com/ganache/)
- [Truffle](https://trufflesuite.com/)  

## Run the project
1. Open ganache
2. Compile the contracts using `truffle compile`
3. Deploy the contracts using `truffle deploy`
4. Change the contract address in `scripts/index.js` with the one in ganache
5. Create a local server with ` http-server http://localhost:8080` or any alternative such as python


