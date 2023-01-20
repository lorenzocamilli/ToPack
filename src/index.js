$("form").submit(function (e) { e.preventDefault(); });

var contractAddress = '0x83e99B42AFca58e3Fb2AcfA40bEf15f6d9aadBF7';
// Set the relative URI of the contract’s skeleton (with ABI)
var contractJSON = "build/contracts/Pack.json"
// Set the sending address
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
  initialise(contractAddress);
});

async function initialise(contractAddress) {

  await window.ethereum.enable();

  const accounts = await ethereum.request({
    method: 'eth_requestAccounts',
  });

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

	// Set the address from which transactions are sent
	//accounts = await web3.eth.getAccounts();  //commentato dopo merge, cancellato da lorenzo
	senderAddress = accounts[0]
	console.log("Sender address set: " + senderAddress)

  // Subscribe to all events by the contract
  contract.events.allEvents(
    callback = function (error, event) {
      if (error) {
        console.error(error)
      }
      console.log(event);
    });

    //Insert other function calls here for the starting

}


async function createPost() {
    var cost = $('#costInput').val();
    if (cost < 1) {
      alert("The given guess should be higher than 0");
      return false;
    }
  
    console.log("Provided cost is: " + cost);
  
    contract.methods.createPost(cost).send({ from: senderAddress, gasLimit: 300000 }).then(function (result) {
      console.log("Price sent: " + cost);
    })

    contract.methods.createPost(senderAddress.toString(), cost).send({ from: senderAddress, gasLimit: 300000 }).then(function (result) {
      console.log("Price sent: " + cost);
    })
  
    return false;
  }


/*
async function getUserPosts(){
  contract.methods.getUserPosts().call((err, result) => { console.log(result) })	
}
*/