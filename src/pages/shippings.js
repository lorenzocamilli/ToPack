var userAddress;
var contract;

$(window).on('load', function () {
    start()
});

function start(){
    run()
    setTimeout(function(){
        userAddress = exportUserAddr();
        contract = exportContract();
        getUserBox();
    }, 500 );
}

function getUserBox() {   
    var res = contract.methods.getUserBox(userAddress.toString()).call({
        from: userAddress, gasLimit: 3000000
    }).then(function (result) {
        console.log("Result", result)
        var shippingCard = ''
        if (result && typeof result === 'object') {
            if (Object.values(result).length == 0) {
                shippingCard = '<h1 style="text-align:center;"> You don\'t have any boxes yet </h1>'
            } else {
                for (let i = 0; i < Object.values(result).length; i++) {
                    convertedShippingCost = convertWeiToEuro(result[i][4]).toFixed(2);
                    convertedBoxValue = convertWeiToEuro(result[i][5]).toFixed(2);
                    shippingCard += '<div class="card border-ligth mx-auto mb-3" style="max-width: 70%; text-alig: center">\
                                    <div class="card-body">\
                                    <h2  class="card-title"><b>Shipping id: '+ result[i][0] + '</b><h2>\
                                        <p class="card-text" >\
                                            <img src="../assets/icons/sender_icon.svg" width="5%"height="5%"> '+ result[i][2] + '<br>\
                                            <img src="../assets/icons/receiver_icon.svg" width="5%"height="5%"> '+ result[i][3] + '<br>\
                                            <img src="../assets/icons/shipping_icon.svg" width="5%"height="5%">'+ convertedShippingCost + '<br>\
                                            <img src="../assets/icons/package_icon.svg" width="5%"height="5%">'+ convertedBoxValue + '\
                                        </p>\
                                        </div>\
                                    </div>';
                }
            }
        }
        $('#cards').append(shippingCard);
    })
}