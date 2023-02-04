$("form").submit(function (e) { e.preventDefault(); });

var contractAddress = exportContract();
// Set the relative URI of the contract’s skeleton (with ABI)
var contractJSON = "../" + exportAbi();
// Set the sending address
var userAddress = '0x0';
// Set contract ABI and the contract
var contract = null;

$(window).on('load', function () {
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
    function (contractData) { // Use of IIFEs: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
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
  travellerAddress = accounts[0]
  console.log("Your address: " + travellerAddress) 

  // Subscribe to all events by the contract
  contract.events.allEvents(
    callback = function (error, event) { // A "function object". Explained here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#The_function_expression_(function_expression)
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
    travellerAddress
  );
  return false;
}

async function deliverBox() {
  console.log("Function correctly called");

  //save the form value
  let boxID = $('#boxID').val();
  let boxValue;
  contract.methods.deliverBox(boxID).call((err, result) => {
    boxValue = result;
    console.log("Res: " + result);
    console.log("Box value: " + boxValue);
    lockMoney(boxValue);
  })

}

async function lockMoney(boxValue){
  web3.eth.sendTransaction({ 
    from: travellerAddress,
    to: contractAddress, 
    value: boxValue 
  }, function(err, transactionHash) {
      if (!err)
        console.log(transactionHash + " success: box value locked."); 
    }
  );  
}