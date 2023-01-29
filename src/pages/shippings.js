

//var contractAddress = '0xd7cBE490a3236A67fb86752540619f05672d2699';
var contractAddress = "0x2299e9bA7FDD6016eC8E39dd8F00C0917E221394";
//console.log(contractAddress)
var contractJSON = "../build/contracts/Pack.json";
console.log(contractJSON)
var senderAddress = '0x0';
var contract;
const ethEnabled = async () => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);
        return true;
    }
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
    var callback;
    contract.events.allEvents(
        callback = function (error, event) {
            if (error) {
                console.error(error)
            }
            console.log(event);
        });

    subscribeToEvents()
    createPost();
    getUserPosts()

}

function subscribeToEvents() {
    var result;
    contract.events.PostsEvent( // Subscribe to all Win events
        function (error, event) {
            if (!error) {
                result = event.PostsEvent();
            }
        }

    );
    return result;
}




async function createPost() {
    if (cost < 1) {
        alert("The given guess should be higher than 0");
        return false;
    }

    var cost = 1000;

    console.log("Provided cost is: " + cost);


    contract.methods.createPost(senderAddress.toString(), senderAddress.toString(), 1111, cost).send({ from: senderAddress, gasLimit: 300000 }).then(function (result) {
        console.log("Price sent: " + cost);
    })




    return false;
}


async function getUserPosts() {


    console.log("Contract", contractAddress)
    console.log("GET", senderAddress)


    var res = contract.methods.getUserPosts(senderAddress.toString()).call((err, result) => {

        var html='<div class="row row-cols-1 row-cols-md-2 g-4"';

        //console.log(result) 
        const campaigns = [];
        for (let i = 0; i < Object.values(result).length; i++) {
            var id = id + result[i]
            html+='<div class="col"><div class="card"><div class="card-body"> <h5 class="card-title"> Cost:'+result[i][3]+'</h5><p class="card-text">Sender:'+ result[i][2]+'</p></div></div></div>'
            $('#cards').append(html);

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


