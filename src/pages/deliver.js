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
    from: userAddress,
    to: contractAddress, 
    value: boxValue 
  }, function(err, transactionHash) {
      if (!err)
        console.log(transactionHash + " success: box value locked."); 
    }
  );  
}