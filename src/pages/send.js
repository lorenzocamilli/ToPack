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
  let shippingCostEUR = $('#shipCost').val(); //get the value in euros
  let boxValueEUR = $('#boxValue').val();  //get the value in euros
  //Check that the addresses are different
  if (userAddress.toLowerCase() == receiverAddr.toLowerCase() || userAddress.toLowerCase() == travellerAddr.toLowerCase()) {
    alert("You can not be involved as traveller or receiver!");
    return;
  }

  if (travellerAddr.toLowerCase() == receiverAddr.toLowerCase()) {
    alert("The two addresses must be different!");
    return;
  }
  //Check the length of the addresses
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
  contract.methods.createBox(userAddress, travellerAddr, receiverAddr, shippingCostWEI.toString(), boxValueWEI.toString()).send({
  from: userAddress, to: contractAddress, value: shippingCostWEI
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

