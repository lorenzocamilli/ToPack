const CONTRACTADDR = "0x39aFF1292C4208Fb8F5FC04B1E2B32022c98199b"
const ABIPATH = "../build/contracts/Pack.json"
var USERADDR = '0x0';
var CONTRACT;
var EUROAMOUNT;
var WEI;
var RESPONSE;
var DATA;
var EURRATE;

function exportContractAddr() {
    return CONTRACTADDR;
}
function exportAbi() {
    return ABIPATH;
}
function exportContract() {
    return CONTRACT;
}

function exportUserAddr() {
    return USERADDR;
}

function showAccountAddr() {
console.log("acc", USERADDR)
    $("#userAddress").html(
        USERADDR
    );
    return false;
}


async function run() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    }

    await window.ethereum.enable();

    const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
    });
    initialise(CONTRACTADDR, accounts)
}

async function initialise(CONTRACTADDR, accounts) {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
    }

    await $.getJSON(ABIPATH,
        function (contractData) {
            CONTRACT = new web3.eth.Contract(contractData.abi, CONTRACTADDR);
        }
    ).catch((error) => { console.error(error); });

    if (!CONTRACT) {
        console.error("No contract loaded.");
        return false;
    }
    USERADDR = accounts[0]
    console.log("Sender address set: " + USERADDR)
    var callback;
    CONTRACT.events.allEvents(
        callback = function (error, event) {
            if (error) {
                console.error(error)
            }
            console.log(event);
        });
    console.log("Contract in conf", CONTRACT)
    setConvVariables();
    showAccountAddr();
}


async function setConvVariables() {
    RESPONSE = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR');
    DATA = await RESPONSE.json();
    EURRATE = DATA.EUR;
}

function convertWeiToEuro(weiAmount) {
    EUROAMOUNT = weiAmount * EURRATE / 10 ** 18;
    console.log(`${weiAmount} weis is equal to ${EUROAMOUNT} euro.`);
    return Math.ceil(EUROAMOUNT);
}


function convertEurosToWei(euros) {
    const ether = euros / EURRATE;
    WEI = ether * 10 ** 18;
    console.log(`${euros} euros is equal to ${WEI} WEI.`);
    return Math.round(WEI);
}