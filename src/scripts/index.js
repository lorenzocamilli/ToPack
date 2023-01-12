const Web3 = require('web3')
web3 = new Web3("http://127.0.0.1:7545")   // connect to ganache
try {
  const listening =  web3.eth.net.isListening()
  console.log(listening)
} catch (error) {
  console.log(error)
}

// abi the of the contract change this at any cheange in the backend (contracts) part
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "newDeliveryTime",
				"type": "uint256"
			}
		],
		"name": "changeDeliveryTime",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postPrice",
				"type": "uint256"
			}
		],
		"name": "createPost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postID",
				"type": "uint256"
			}
		],
		"name": "deletePost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getUserPosts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "postID",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "postAuthor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "postPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "postCreationTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "deliverTime",
						"type": "uint256"
					}
				],
				"internalType": "struct Pack.Post[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "usersBalnce",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// address of the contract 
const contractAddress = '0xe68D54263F7eBd8A59F2896e5a8C0e40948ECC83'	// CHANGE THIS
// address of the user 
const  userAddress = '0x3bC93bd5e2E9c07aACE7f281b6f149D6A03a0f2b'	// CHANGE THIS

const contract = new web3.eth.Contract(abi, contractAddress)

const postID = 0	// placeholder of the post, necessary only to call the changeDeliveryTime and deletePost methods
const newDeliveryTime = 10 // placeholder of the post, necessary only to call the deletePost method

contract.methods.createPost(111111111).send({from: userAddress, gasLimit:300000 });
contract.methods.getUserPosts().call((err, result) => { console.log(result) })
//contract.methods.deletePost(postID).send({from: userAddress, gasLimit:300000 });
//contract.methods.changeDeliveryTime(postID, newDeliveryTime).send({from: userAddress, gasLimit:300000 });
