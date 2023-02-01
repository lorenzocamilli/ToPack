
var contractAddress = exportContract();
var contractJSON = exportAbi();
var senderAddress = '0x0';
var contract = null;

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







