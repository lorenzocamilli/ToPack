# ToPack

Project for the Blockchain and Distributed Ledger Technologies (A.Y. 2022-2023). The aim is to create a blockchain based decentralized app using [Solidity](https://soliditylang.org/).

ToPack have the purpose to help the people to deliver packs in a secure and not expensive way. In fact an user can create a post with a pack to send, an other user can accept to deliver the pack and propose itself as delivery. When a delivery man completes the shipment on time, he will receive the prizes offered by the post, otherwise he will receive a penalty for each day of delay or for having lost the package.
Any step is guaranteed by the blockchain.

## Requirements
- Solidity
- An IDE for Solidity, a good choice is [Remix IDE](https://remix-project.org/) or VSCode
- [NodeJS](https://trufflesuite.com/ganache/) and the required libraries. To install the libraries run `npm install` in  `src/` directory 
- [Ganache](https://trufflesuite.com/ganache/)
- [Truffle](https://trufflesuite.com/)  
- [Metamask](https://metamask.io/download/) extension

## Run the project
1. Open Ganache.
2. Compile the contracts using `truffle compile` (run it in `src/` directory).
3. Deploy the contracts using `truffle deploy`.
4. Change the contract address in `pages/config.js` with the one in ganache
5. Create a local server with ` http-server http://localhost:8080` or any alternative such as python (`python -m http.server`).
6. Connect Metamask to Ganache chain.
7. Add accounts in Metamask (importing the private keys), we suggest to use 3 different accounts (one for the sender, one for the traveller and the last for the receiver).
8. Try it. The sender is that one that create the post in `pages/send.html` page, then the traveller confirm that it has received the box inserting the id (in `pages/deliver.js`) of the shipping created by the sender, and accept the transaction to block the box value amount, this is important to avoid that the travelelr lose and stole the box, if the box it's correctly received it will receive back the money. Finally the receiver insert the id of the box (in `/pages/received.html`) when it receive the box, at this point the contract unlock the money: the box value will give back to the travller and use the shipping cost to pay the work of the traveller.

