const Web3 = require('web3')
web3 = new Web3("http://127.0.0.1:7545")
try {
  const listening =  web3.eth.net.isListening()
  console.log(listening)
} catch (error) {
  console.log(error)
}
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

const contractAddress = '0x3681C41F7F698C28FfB5351a85b2Fc0c52057Db4'
const  userAddress = '0xd4dAf7F9841DFd496cb90A54fa198cb1873f0126'
const contract = new web3.eth.Contract(abi, contractAddress)

const postID = 0
const newDeliveryTime = 10

contract.methods.createPost(111111111).send({from: userAddress, gasLimit:300000 });
contract.methods.getUserPosts().call((err, result) => { console.log(result) })
contract.methods.deletePost(postID).send({from: userAddress, gasLimit:300000 });
contract.methods.changeDeliveryTime(postID, newDeliveryTime).send({from: userAddress, gasLimit:300000 });
