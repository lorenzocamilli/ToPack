
var contractAddress = exportContract();
var contractJSON = "../" + exportAbi();
console.log(contractJSON)
var userAddress = '0x0';
var contract;
var response;
var data;
var eurRate;

$(window).on('load', function () {
    setConvVariables();
});

async function setConvVariables() {
    response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR');
    data = await response.json();
    eurRate = data.EUR;
    run();
}


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
    userAddress = accounts[0]
    console.log("Sender address set: " + userAddress)
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

    var res = contract.methods.getTravellerBoxes(userAddress.toString()).call((err, result) => {
        var shippingCard = ''
        if (result && typeof result === 'object') {
            if (Object.values(result).length == 0) {
                shippingCard = '<h1 style="text-align:center;"> You don\'t have any boxes yet </h1>'
            } else {
                for (let i = 0; i < Object.values(result).length; i++) {
                    convertedShippingCost = convertWeiToEuro(result[i][4]).toFixed(2);
                    convertedBoxValue = convertWeiToEuro(result[i][5]).toFixed(2);
                    shippingCard += '<div class="card border-ligth mx-auto mb-3" style="max-width: 70%; text-alig: center">\
                                    <div class="card-body">\
                                    <h2  class="card-title"><b>Shipping id: '+ result[i][0] + '</b><h2>\
                                        <p class="card-text" >\
                                            <img src="../assets/icons/sender_icon.svg" width="5%"height="5%"> '+ result[i][1] + '<br>\
                                            <img src="../assets/icons/receiver_icon.svg" width="5%"height="5%"> '+ result[i][3] + '<br>\
                                            <img src="../assets/icons/shipping_icon.svg" width="5%"height="5%">'+ convertedShippingCost + '<br>\
                                            <img src="../assets/icons/package_icon.svg" width="5%"height="5%">'+ convertedBoxValue + '\
                                        </p>\
                                        </div>\
                                    </div>';
                }
            }
            $('#cards').append(shippingCard);
        }
    })
}


function convertWeiToEuro(weiAmount) {
    const euroAmount = weiAmount * eurRate / 10 ** 18;
    console.log(`${weiAmount} weis is equal to ${euroAmount} euro.`);
    return euroAmount;
}
