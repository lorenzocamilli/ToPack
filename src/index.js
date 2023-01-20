
var contractAddress = '0xD63878db565546B39F58d32EF6d42814480C8e0f';
var contractJSON = "build/contracts/Pack.json";
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
/*
$(window).on('load', function () {
  initialise(contractAddress);
});
*/

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
  contract.events.numberOfAddresses( // Subscribe to all Win events
    function (error, event) {
      if (!error) {
        var numero = event.returnValues();
      }
    }

  );
  return numero;
}

async function createPost() {
  var cost = $('#costInput').val();
  if (cost < 1) {
    alert("The given guess should be higher than 0");
    return false;
  }

  console.log("Provided cost is: " + cost);


  contract.methods.createPost(senderAddress.toString(), cost).send({ from: senderAddress, gasLimit: 300000 }).then(function (result) {
    console.log("Price sent: " + cost);
  })


  console.log(subscribeToEvents)()

  return false;
}



async function getUserPosts() {

  console.log("GET", senderAddress)
  contract.methods.getUserPosts(senderAddress.toString()).call((err, result) => { console.log(result) })
}



async function Posts() {



}