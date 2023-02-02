$("form").submit(function (e) { e.preventDefault(); });

var contractAddress = exportContract();
// Set the relative URI of the contract’s skeleton (with ABI)
var contractJSON = "../" + exportAbi();
// Set the sending address
var senderAddress = '0x0';
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
  senderAddress = accounts[0]
  console.log("Sender address set: " + senderAddress)

  contract.methods.deposit().send({from: senderAddress,to: contractAddress,
    value: 200000000000000000})
    .then(function (result){
      console.log("2 ETH depositati");
    })

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
    senderAddress
  );
  return false;
}

async function giveBox() {
  console.log("Function correctly called");
  //prendo le variabili dal form:
  var travellerAddr = $('#travellerAddr').val();
  var receiverAddr = $('#receiverAddr').val();
  let shippingCost = $('#shipCost').val();
  let boxValue = $('#boxValue').val();
  //Controllo che gli address forniti in input siano diversi
  if (travellerAddr == receiverAddr) {
    alert("The two addresses must be different!");
    return;
  }
  //Controllo lunghezza address
  if (travellerAddr.length !== 42) {
    alert("Traveller address is not valid!");
    return;
  }
  if (receiverAddr.length !== 42) {
    alert("Receiver address is not valid!");
    return;
  }

  senderBalance = Number(await web3.eth.getBalance(senderAddress));
  if (senderBalance < shippingCost) { // check if the shipper has enough money to pay for the shipment
    alert("The sender does not have enough money to pay the shipment of the box.");
    return;
  }

  travellerBalance = Number(await web3.eth.getBalance(travellerAddr)); 
  if (travellerBalance < boxValue) { // check if the traveller has enough money to cover for the box value
    alert("The traveller does not have enough money to cover for the value of the box.");
    return;
  }
  shippingCostHex = shippingCost.toString(16);  
  
  /*
  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: senderAddress,
          to: contractAddress,
          value: shippingCostHex,
          gas: '0x493e0', // 300000
          //gasPrice: '0x9184e72a000', // 10000000000000
        },
      ],
    })
    .then((txHash) => console.log(txHash))
    .catch((error) => console.error);
*/
/*
  web3.eth.sendTransaction({ 
    from: senderAddress,
    to: contractAddress, 
    value: shippingCost 
  }, function(err, transactionHash) {
      if (!err)
        console.log(transactionHash + " success"); 
    }
  );*/
  //.then( function(tx) { ;
  //console.log("Shipment cost locked - Transaction: ", tx); 
  //});
  //console.log("finita");
  /*
  web3.eth.sendTransaction({ 
    from: travellerAddr,
    to: contractAddress, 
    value: boxValue 
  }).then( function(tx) { ;
  console.log("Box value locked - Transaction: ", tx); 
  });*/
/*
  contract.methods.assignBox(senderAddress, travellerAddr, receiverAddr, shippingCost, boxValue).send({
    from: senderAddress, to: contractAddress, gasLimit: 300000
  }).then(function (result) {
    console.log("Box in shipment - Transaction: ");
    console.log("Sender: " + senderAddress);
    console.log("Traveller: " + travellerAddr);
    console.log("Receiver: " + receiverAddr)
    console.log("Shipping cost: " + shippingCost);
    console.log("Box value: " + boxValue);

  })*/
}