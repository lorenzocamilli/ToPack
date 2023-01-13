const Web3 = require('web3');
const fs = require('fs')
web3 = new Web3("http://127.0.0.1:7545")   // connect to ganache
const contractAddress = '0x309E4a87986FBFF10c17BF5F227a7307EF7d64C1'	// CHANGE THIS

async function web3Contract() {
	const path = require('path');
	const abi = require(path.join(__dirname, './Pack.json'));
    const Pack = await new web3.eth.Contract(abi, contractAddress);
    const accounts = await web3.eth.getAccounts();

	const postID = 0	// placeholder of the post, necessary only to call the changeDeliveryTime and deletePost methods
	const newDeliveryTime = 10 // placeholder of the post, necessary only to call the deletePost method
	Pack.methods.getUserPosts().call({from:accounts[0]});
	Pack.methods.createPost(111111111).send({from: userAddress, gasLimit:300000 });
	//Pack.methods.deletePost(postID).send({from: userAddress, gasLimit:300000 });
	//Pack.methods.changeDeliveryTime(postID, newDeliveryTime).send({from: userAddress, gasLimit:300000 });
}

async function run() {
    try {
        await web3Contract();
    } catch (err) {
        console.log(err);
    } 
}

run();

