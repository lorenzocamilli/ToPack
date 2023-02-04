$("form").submit(function (e) { e.preventDefault(); });

var contractAddress = exportContract();
// Set the relative URI of the contract’s skeleton (with ABI)
var contractJSON = "../" + exportAbi();
// Set the sending address
var userAddress = '0x0';
// Set contract ABI and the contract
var contract = null;

var response;
var data;
var eurRate;

$(window).on('load', function () {
  initialise(contractAddress);
  setConvVariables();
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
  userAddress = accounts[0]
  console.log("Sender address set: " + userAddress)
  /*
    //deposit some money onto the contract
    contract.methods.deposit().send({from: userAddress,to: contractAddress,
      value: 20000000000000000000})
      .then(function (result){
        console.log("20 ETH depositati");
      })*/

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
    userAddress
  );
  return false;
}

async function giveBox() {
  console.log("Function correctly called");
  //prendo le variabili dal form:
  var travellerAddr = $('#travellerAddr').val();
  var receiverAddr = $('#receiverAddr').val();
  let shippingCostEUR = $('#shipCost').val(); //val in euro
  let boxValueEUR = $('#boxValue').val();
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

  let shippingCostWEI = convertEurosToWei(shippingCostEUR);
  let boxValueWEI = convertEurosToWei(boxValueEUR);

  senderBalance = Number(await web3.eth.getBalance(userAddress));
  if (senderBalance < shippingCostWEI) { // check if the shipper has enough money to pay for the shipment
    alert("The sender does not have enough money to pay the shipment of the box.");
    return;
  }

  travellerBalance = Number(await web3.eth.getBalance(travellerAddr));
  if (travellerBalance < boxValueWEI) { // check if the traveller has enough money to cover for the box value
    alert("The traveller does not have enough money to cover for the value of the box.");
    return;
  }


  // here we lock the money from the sender
  web3.eth.sendTransaction({
    from: userAddress,
    to: contractAddress,
    value: shippingCostWEI
  }, function (err, transactionHash) {
    if (!err)
      console.log(transactionHash + " success: shipping cost locked.");
  }
  );

  contract.methods.assignBox(userAddress, travellerAddr, receiverAddr, shippingCostWEI.toString(), boxValueWEI.toString()).send({
    from: userAddress, to: contractAddress, gasLimit: 300000
  }).then(function (result) {
    console.log("Box in shipment - Transaction: ");
    console.log("Sender: " + userAddress);
    console.log("Traveller: " + travellerAddr);
    console.log("Receiver: " + receiverAddr)
    console.log("Shipping cost: " + shippingCostWEI + " WEI");
    console.log("(" + shippingCostEUR + " EUR)");

    console.log("Box value: " + boxValueWEI + " WEI");
    console.log("(" + boxValueEUR + " EUR)");
  })
}


async function setConvVariables() {
  response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR');
  data = await response.json();
  eurRate = data.EUR;
}

function convertEurosToWei(euros) {
  const ether = euros / eurRate;
  const wei = ether * 10 ** 18;
  console.log(`${euros} euros is equal to ${wei} wei.`);
  return wei;
}


function convertWeiToEuro(weiAmount) {
  const euroAmount = weiAmount * eurRate / 10 ** 18;
  console.log(`${weiAmount} weis is equal to ${euroAmount} euro.`);
  return euroAmount;
}