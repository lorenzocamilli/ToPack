$("form").submit(function (e) { e.preventDefault(); });

var contractAddress = '0xC9bF68699ce5C685b229Db6D688519027586bC23';
var contractJSON = "build/contracts/Pack.json"
var senderAddress = '0x0';
var contract = null;

const ethEnabled = async () => {
  if (window.ethereum) {
    console.log("If")
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    window.web3 = new Web3(window.ethereum);
    return true;
  }
  console.log("esle")

  return false;
}

$(window).on('load', function () {
  initialise(contractAddress);
});

async function initialise(contractAddress) {

  await window.ethereum.enable();

  const accounts = await ethereum.request({
    method: 'eth_requestAccounts',
  });

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
  senderAddress = accounts[0]
  console.log("Sender address set: " + senderAddress)

  contract.events.allEvents(
    callback = function (error, event) {
      if (error) {
        console.error(error)
      }
      console.log(event);
    });


}


async function createPost() {
  var cost = $('#costInput').val();
  if (cost < 1) {
    alert("The given guess should be higher than 0");
    return false;
  }

  console.log("Provided cost is: " + cost);

  contract.methods.createPost(senderAddress.toString(), cost).send({ from: senderAddress, gasLimit: 300000 }).then(function (result) {
    console.log("Price sent: " + cost);
  })

  return false;
}



async function getUserPosts() {

  console.log("GET", senderAddress)
  contract.methods.getUserPosts(senderAddress.toString()).call((err, result) => { console.log(result) })
}