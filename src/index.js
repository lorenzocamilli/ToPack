const Web3 = require('web3');
web3 = new Web3("http://127.0.0.1:7545")   // connect to ganache
const contractAddress = '0xfd48F8c5e1109feb878d353F4E2F25aB72F03776'	// CHANGE THIS
//const  userAddress = '0x3bC93bd5e2E9c07aACE7f281b6f149D6A03a0f2b'	// CHANGE THIS
var senderAddress = '0x0';
var contract = null;
var contractJSON = "./Pack.json"


async function web3Contract() {
	const path = require('path');
	const abi = require(path.join(__dirname, 'Pack.json'));
    console.log(abi);

    const contract = new web3.eth.Contract(abi, contractAddress);
    console.log(contract)
    
    const accounts = await web3.eth.getAccounts();
	console.log(accounts[0])
	senderAddress = accounts[0]
	console.log("Sender address set: " + senderAddress)

//	const postID = 15	// placeholder of the post, necessary only to call the changeDeliveryTime and deletePost methods
//	const newDeliveryTime = 10 // placeholder of the post, necessary only to call the deletePost method
//	 	contract.methods.getUserPosts().call((err, result) => { console.log(result) })	//contract.methods.createPost(111111111).send({from: userAddress, gasLimit:300000 });
	contract.methods.createPost(111111111).send({from: userAddress, gasLimit:300000 });
//	contract.methods.deletePost(postID).send({from: userAddress, gasLimit:300000 });
	//contract.methods.changeDeliveryTime(postID, newDeliveryTime).send({from: userAddress, gasLimit:300000 });
}

async function run() {
    try {
        await web3Contract();
    } catch (err) {
        console.log(err);
    } 
}

run();

