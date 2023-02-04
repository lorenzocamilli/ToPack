$("form").submit(function (e) { e.preventDefault(); });

var contractAddress = exportContract();
var contractJSON = "../" + exportAbi();
var userAddress = '0x0';
var contract = null;
var response;
var data;
var eurRate;

$(window).on('load', function () {
  initialise(contractAddress);
});

async function initialise(contractAddress) {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
  }

 await $.getJSON(contractJSON,
    function (contractData) { 
      contract = new web3.eth.Contract(contractData.abi, contractAddress);
    }
  ).catch((error) => { console.error(error); });

  if (!contract) {
    console.error("No contract loaded.");
    return false;
  }

  accounts = await web3.eth.getAccounts();
  userAddress = accounts[0]
  console.log("Sender address set: " + userAddress)
 
  contract.events.allEvents(
    callback = function (error, event) { // A "function object". Explained here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#The_function_expression_(function_expression)
      if (error) {
        console.error(error)
      }
      console.log(event);
    });

  await showAccountAddr();
}



//Displays the account address
function showAccountAddr() {
  $("#myaccountaddress").html(
    userAddress
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
    from: userAddress,
    to: contractAddress, 
    value: boxValue 
  }, function(err, transactionHash) {
      if (!err)
        console.log(transactionHash + " success: box value locked."); 
    }
  );  
}