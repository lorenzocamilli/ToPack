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