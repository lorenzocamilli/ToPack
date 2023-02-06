$("form").submit(function (e) { e.preventDefault(); });
run();
var userAddress;
var contract;
var response;
var data;
var eurRate;

$(window).on('load', function () {
  upload();
});

async function upload() {
  userAddress = exportUserAddr();
  contract = exportContract();
  console.log("User addres", userAddress)
  console.log("Contract", contract)
}

async function endBox() {
  console.log("Function correctly called");

  //save the form value
  let boxID = $('#boxID').val();

  contract.methods.BoxDelivered(boxID.toString()).send({
    from: userAddress, to: contractAddress, gasLimit: 300000
  }).then(function (result) {
    console.log("Box " + boxID + "delivered - Transaction: success");
  })
}