var userAddress;
var contract;
var contractAddress;

$(window).on('load', function () {
  start()
});

function start() {
  run()
  setTimeout(function () {
    userAddress = exportUserAddr();
    contractAddress = exportContractAddr();
    contract = exportContract();
  }, 500);
}


async function endBox() {
  console.log("Function correctly called");

  //save the form value
  let boxID = $('#boxID').val();

  contract.methods.boxDelivered(boxID.toString()).send({
    from: userAddress, to: contractAddress, gasLimit: 300000
  }).then(function (result) {
    console.log("Box " + boxID + "delivered - Transaction: success");
  })
}