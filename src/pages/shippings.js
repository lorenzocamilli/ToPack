
var contractAddress = exportContract();
var contractJSON = "../"+exportAbi();
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
        console.log("Res",res)
        if (result && typeof result === 'object') {
            console.log("Entrato nel if")
            for (let i = 0; i < Object.values(result).length; i++) {
                shippingCard += '<div class="card border-ligth mx-auto mb-3" style="max-width: 70%; text-alig: center">\
                                        <div class="card-body">\
                                        <h2  class="card-title"><b>Shipping id: '+ result[i][0] + '</b><h2>\
                                            <p class="card-text" >\
                                                <img src="../assets/icons/sender_icon.svg" width="5%"height="5%"> '+ result[i][2] + '<br>\
                                                <img src="../assets/icons/receiver_icon.svg" width="5%"height="5%"> '+ result[i][3] + '<br>\
                                                <img src="../assets/icons/shipping_icon.svg" width="5%"height="5%">'+ result[i][4] + '<br>\
                                                <img src="../assets/icons/package_icon.svg" width="5%"height="5%">'+ result[i][5] + '\
                                            </p>\
                                            </div>\
                                        </div>';
            }
        }
        $('#cards').append(shippingCard);
    })
}
