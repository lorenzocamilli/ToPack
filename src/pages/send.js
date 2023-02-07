var userAddress
var contract
var contractAddress

$(window).on('load', function () {
  start();
});

function start() {
  run()
  setTimeout(function () {
    userAddress = exportUserAddr();
    contractAddress = exportContractAddr();
    contract = exportContract();
  }, 500);
}

async function giveBox() {
  console.log("Function correctly called");
  var travellerAddr = $('#travellerAddr').val();
  var receiverAddr = $('#receiverAddr').val();
  let shippingCostEUR = $('#shipCost').val(); //val in euro
  let boxValueEUR = $('#boxValue').val();
  //Controllo che gli address forniti in input siano diversi
  if (userAddress == receiverAddr || userAddress == travellerAddr) {
    alert("You can not be involved as traveller or receiver!");
    return;
  }

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
    from: userAddress, to: contractAddress, gasLimit: 3000000
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

