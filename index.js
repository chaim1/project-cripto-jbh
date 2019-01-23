window.onload = function () {
    jQuery('#homeClick').click();
}

var coinArray = [];
var htmlDataCoin = '';

$('#mainNav>li>a').click(function (e) {
    $('#mainContent').empty();
    $('#circle').show();
    e.preventDefault();
    const link = $(this).attr('data-link');
    const href = $(this).attr('href');
    $.ajax(`templates/${href}.html`)
        .done(function (htmlData) {
            htmlDataCoin = htmlData;
            getData(htmlData, link);
        });
});

const getData = (htmlData, link) => {
    if (coinArray.length == 0) {
        $.ajax({
            url: link,
            method: 'GET',
        }).done(function (d) {
            if (typeof d === 'string')
                d = JSON.parse(d);
            for (let i = 0; i < d.length; i++) {
                coinArray.push(d[i]);
            }
            setData(coinArray, htmlData)
        });
    } else {
        console.log(2);
        setData(coinArray, htmlData)
    }
}


var precens = 3;
function setData(coinArray, htmlData) {
    $('#mainContent').empty();
    $('#circle').show();
    var p = 0;
    for (let i = 0; i < coinArray.length; i++) {
        p++
        var onePres = coinArray.length / 100;
        if (p > onePres) {
            precens++
            p = 0;
        }
        if (precens > 99) {
            $('#circle').hide();
        }
        var temp = htmlData;
        temp = temp.replace(/{id}/g, coinArray[i]['id']);
        temp = temp.replace(/{symbol}/g, coinArray[i]['symbol']);
        temp = temp.replace(/{name}/g, coinArray[i]['name']);
        temp = temp.replace(/{collapse}/g, "cl" + coinArray[i]['id']);
        $('#mainContent').append(temp);
    }
}

//SearchClick

$('#SearchClick').click(function () {
    var search = $('#SearchInput').val();
    if (search.length > 1) {
        $('#mainContent').empty();
        $('#circle').show();
        var fun = (str) => {
            return str.charAt(0).toLowerCase() + str.slice(1);
        }
        search = fun($('#SearchInput').val());
        var coin = coinArray.filter(function (coin) { return coin.id == search }) ? coinArray.filter(function (coin) { return coin.id == search }).length > 0 : coin = coinArray;

        if (coin == true) {
            coin = coinArray.filter(function (coin) { return coin.id == search });
        } else {
            coin = coinArray;
            alert("the requested currency is not found, make sure you enter a proper name");
        }
        $('#mainContent').empty();
        $('#circle').show();
        $('#SearchInput').val('');
        setData(coin, htmlDataCoin)
    } else {
        alert("Insert a coin");
    }
    // coin.length > 0 ? setData(coin, htmlDataCoin) : alert("the requested currency is not found, make sure you enter a proper name");
});

//https://api.coingecko.com/api/v3/coins/bitcoin

// TUDU enter simbol price 
function morInfo(coinId, divId, simbol) {
    let sroreg = localStorage.getItem(simbol);
    if (sroreg) {        
        sroreg = JSON.parse(sroreg);
        setMorData(coinId, divId, simbol,sroreg);
    } else {
        $.ajax(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .done(function (coindata) {
                var objItemCoin = {};
                objItemCoin.img = coindata['image']['large'];
                objItemCoin.priceUsd = coindata['market_data']['current_price'].usd;
                objItemCoin.priceEur = coindata['market_data']['current_price'].eur;
                objItemCoin.priceIls = coindata['market_data']['current_price'].ils;
                setMorData(coinId, divId, simbol,objItemCoin);
                objItemCoin = JSON.stringify(objItemCoin);
                localStorage.setItem(simbol, objItemCoin);
                setInterval(() => {
                    localStorage.removeItem(simbol)
                }, 100000);
            });
    }
}

function setMorData(coinId, divId, simbol,arrayData) {
    var tempMoreInfo = `<div class="card card-body">
    <img  src="${arrayData.img}" alt=" ${coinId} image" height="55px" width="70px">
    <p><strong>Price: </strong> <p>${simbol} ${arrayData.priceUsd}$ </p><p>${simbol} ${arrayData.priceEur}# </p><p>${simbol} ${arrayData.priceIls}@ </p></p>
</div>`
    document.getElementById(divId).innerHTML = tempMoreInfo;
}




//css dynamic

var width = window.innerWidth;
var height = window.innerHeight;


$window = $(window);
var positionNav = $("#header-nav").offset();
var heightNav = $("#header-nav").height();
$window.scroll(function (e) {
    let lastPosition = window.scrollY;

    if ($window.scrollTop() > positionNav.top) {
        $("#header-nav").addClass('fixed-top')
        $("#mainContent").css({ marginTop: heightNav })
    } else {
        $("#header-nav").removeClass('fixed-top')
        $("#mainContent").css({ marginTop: '0' })
    }
});



if (width < 1100) {
    $("#navBar").removeClass('container')
    $("#navBar").addClass('container-fluid')
    $("#divMenu").removeClass('container')
    $("#divMenu").addClass('container-fluid')
}

//live report
//https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD
 function addToReport(symbol){
     alert(symbol);
}





// function name(i) {
//  var interval =   setInterval(() => {
//      i++
//         var temp = `<div class="progress">
//     <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="" aria-valuemin="0"
//         aria-valuemax="100" style="width:${ i }%">
//         ${ i }%
//     </div>
//     </div>`;
//     $('#test').html(temp);
//     console.log(i);
//     if(i==100){
//         clearInterval(interval);
//     }

//     }, 10);
// } 
// name(0)
