

//var contractAddress = '0xd7cBE490a3236A67fb86752540619f05672d2699';
var contractAddress = "0x23517aa7A1a2664AC1C4Cc5AB04fEaEcB14C8b16";
//console.log(contractAddress)
var contractJSON = "../build/contracts/Pack.json";
console.log(contractJSON)
var senderAddress = '0x0';
var contract;

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
    console.log("Get account:", accounts)
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


    getUserBox()
}

async function getUserBox() {

    var res = contract.methods.getUserBox(senderAddress.toString()).call((err, result) => {
        var shippingCard = ''

        for (let i = 0; i < Object.values(result).length; i++) {
            shippingCard += '<div class="card border-ligth mx-auto mb-3" style="max-width: 85%;">\
                                    <div class="card-body">\
                                    <h2  class="card-title" align><b>Shipping id: '+ result[i][0] + '</b><h2>\
                                        <p class="card-text">\
                                            <img src="../assets/icons/sender_icon.svg" width="5%"height="5%"> '+ result[i][2] + '<br>\
                                        <img src="../assets/icons/package_icon.svg" width="5%"height="5%">'+ result[i][3] + '<br>\
                                        <img src="../assets/icons/shipping_icon.svg" width="5%"height="5%">'+ result[i][4] + '\
                                    </p></div>\
                                    </div>';
        }
        $('#cards').append(shippingCard);

    })
}
