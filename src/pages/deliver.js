var userAddress;
var contract;
var contractAddress;

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


async function deliverBox() {
  console.log("Function correctly called");

  //save the form value
  let boxID = $('#boxID').val();
  let boxValue;
  contract.methods.getBoxValue(boxID).call((err, result) => {
    boxValue = result;
    console.log("Res: " + result);
    console.log("Box value: " + boxValue);
    lockMoney(boxValue);
  })
}

async function lockMoney(boxValue) {
  web3.eth.sendTransaction({
    from: userAddress,
    to: contractAddress,
    value: boxValue
  }, function (err, transactionHash) {
    if (!err)
      console.log(transactionHash + " success: box value locked.");
  }
  );
}