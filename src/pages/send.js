$("form").submit(function (e) { e.preventDefault(); });

var contractAddress = '0xAad5ACd8896DefF3e26a0Cd34515D40b43306d07';
// Set the relative URI of the contract’s skeleton (with ABI)
var contractJSON = "../build/contracts/Pack.json"
// Set the sending address
var senderAddress = '0x0';
// Set contract ABI and the contract
var contract = null;

$(window).on('load', function() {
  initialise(contractAddress);
});

// Asynchronous function (to work with modules loaded on the go)
// For further info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function
async function initialise(contractAddress) {
  // Initialisation of Web3
	if (typeof web3 !== 'undefined') {
	  web3 = new Web3(web3.currentProvider);
	} else {
	  // Set the provider you want from Web3.providers
    // Use the WebSocketProvider to enable events subscription.
	  web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
	}

  // Load the ABI. We await the loading is done through "await"
  // More on the await operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
  await $.getJSON(contractJSON,
    function( contractData ) { // Use of IIFEs: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
      // console.log(contractAbi);
      contract = new web3.eth.Contract(contractData.abi, contractAddress);
    }
  ).catch((error) => { console.error(error); });
  // Arrow funcction expression at work. For further info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

  if (!contract) {
    console.error("No contract loaded.");
    return false;
  }

	// Set the address from which transactions are sent
	accounts = await web3.eth.getAccounts();
	//console.log(accounts[0])
	senderAddress = accounts[0]
	console.log("Sender address set: " + senderAddress)

	// Subscribe to all events by the contract
	contract.events.allEvents(
	callback=function(error, event){ // A "function object". Explained here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#The_function_expression_(function_expression)
      if (error) {
        console.error(error)
      }
      console.log(event);
  });

    //Insert other function calls here for the starting
    
    //Wait the sender address to be displayed
	await showAccountAddr();
}
//Displays the account address
function showAccountAddr() {
    $("#myaccountaddress").html(
		senderAddress
	);
	return false;
}

async function giveBox(){
  console.log("centratoiao");
  //prendo le variabili dal form:
  var travellerAddr = $('#travellerAddr').val();
  var receiverAddr = $('#receiverAddr').val();
  var cost = $('#shipCost').val();
  var value = $('#shipCost').val();

  contract.methods.sendBox(senderAddress.toString(), travellerAddr.toString(), receiverAddr.toString(), cost, value).send({
    from: senderAddress, gasLimit: 300000}).then(function (result) {
      console.log("ciao");
    })


    /*
  contract.methods.sendBox(senderAddress.toString(), cost).send({ from: senderAddress, gasLimit: 300000 }).then(function (result) {
    console.log("Price sent: " + cost);
  })*/

}