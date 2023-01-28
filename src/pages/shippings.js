import { CONTRACT } from "../config";


//var contractAddress = '0xd7cBE490a3236A67fb86752540619f05672d2699';
contractAddress =  CONTRACT;
var contractJSON = "../build/contracts/Pack.json";
var senderAddress = '0x0';
var contract = null;
const ethEnabled = async () => {
    if (window.ethereum) {
        console.log("If");
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);
        return true;
    }
    console.log("esle");

    return false;
}

$(window).on('load', function () {
    run();
});


async function run() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    }

    await window.ethereum.enable();

    const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
    });
    initialise(contractAddress, accounts)
}


async function initialise(contractAddress, accounts) {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
    }

    await $.getJSON(contractJSON,
        function (contractData) {
            contract = new web3.eth.Contract(contractData.abi, contractAddress);
        }
    ).catch((error) => { console.error(error); });

    if (!contract) {
        console.error("No contract loaded.");
        return false;
    }
    senderAddress = accounts[0]
    console.log("Sender address set: " + senderAddress)

    contract.events.allEvents(
        callback = function (error, event) {
            if (error) {
                console.error(error)
            }
            console.log(event);
        });


}

function subscribeToEvents() {
    contract.events.PostsEvent( // Subscribe to all Win events
        function (error, event) {
            if (!error) {
                var numero = event.PostsEvent();
            }
        }

    );
    return numero;
}




async function createPost() {
    if (cost < 1) {
        alert("The given guess should be higher than 0");
        return false;
    }

    var cost = 1000;

    console.log("Provided cost is: " + cost);


    contract.methods.createPost(senderAddress.toString(), senderAddress.toString(), 1111,  cost).send({ from: senderAddress, gasLimit: 300000 }).then(function (result) {
        console.log("Price sent: " + cost);
    })




    return false;
}


async function getUserPosts() {
    console.log("Contract", contractAddress)
    console.log("GET", senderAddress)

    var res = contract.methods.getUserPosts(senderAddress.toString()).call((err, result) => { 
        
        
        
        //console.log(result) 
        const campaigns = [];
        for (let i = 0; i < Object.values(result).length; i++) {
            const id = result[i]
            console.log("RI", result[i][5])
        }



    
    })


/*
    var r = await contract.methods.getUserPosts(senderAddress.toString())
        .call({ from: senderAddress })
        .then(async function (result) {
            const campaigns = [];
            for (let i = 0; i < Object.values(result).length; i++) {
                const id = result[i]
            }
            console.log("C", campaigns)

        });
    console.log("R", r)

    */
}


