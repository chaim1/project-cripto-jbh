window.onload = function () {
    jQuery('#homeClick').click();
}

var coinArray = [];
var htmlDataCoin = '';

$('#homeClick').click(function (e) {
    coinsRegister = []
    $('#mainContent').removeClass('d-none');
    $('#mainContent').empty();
    $('#circle').show();
    $('#chartContainer').removeClass('d-block');
    $('#chartContainer').addClass('d-none');
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
        temp = temp.replace('{buttonInfo}', 'More Info')
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

// TODO enter simbol price 
function morInfo(coinId, divId, simbol) {

    var buttonText = document.getElementById(divId).previousElementSibling;
    if ($(buttonText).hasClass('btn-info')) {
        $(buttonText).removeClass('btn-info')
        $(buttonText).addClass('btn-success')
    } else {
        $(buttonText).removeClass('btn-success')
        $(buttonText).addClass('btn-info')
    }
    buttonText.innerHTML = buttonText.innerHTML.includes('More Info') ? 'Less Info' : 'More Info';
    // buttonText.style.backgroundColor = buttonText.style.backgroundColor.includes("lightblue")? "blue" : "lightblue";
    let sroreg = localStorage.getItem(simbol);
    if (sroreg) {
        sroreg = JSON.parse(sroreg);
        setMorData(coinId, divId, simbol, sroreg);
    } else {
        $.ajax(`https://api.coingecko.com/api/v3/coins/${coinId}`)
            .done(function (coindata) {
                var objItemCoin = {};
                objItemCoin.img = coindata['image']['large'];
                objItemCoin.priceUsd = coindata['market_data']['current_price'].usd;
                objItemCoin.priceEur = coindata['market_data']['current_price'].eur;
                objItemCoin.priceIls = coindata['market_data']['current_price'].ils;
                setMorData(coinId, divId, simbol, objItemCoin);
                objItemCoin = JSON.stringify(objItemCoin);
                localStorage.setItem(simbol, objItemCoin);
                setInterval(() => {
                    localStorage.removeItem(simbol)
                }, 20000);
            });
    }
}

function setMorData(coinId, divId, simbol, arrayData) {
    var tempMoreInfo = `<div class="card card-body">
    <img  src="${arrayData.img}" alt=" ${coinId} image" height="55px" width="70px">
    <p><strong>Price: </strong> <p>${simbol} ${arrayData.priceUsd}$ </p><p>${simbol} ${arrayData.priceEur}# </p><p>${simbol} ${arrayData.priceIls}@ </p></p>
</div>`
    document.getElementById(divId).innerHTML = tempMoreInfo;
}




//live report
//https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC&tsyms=USD
var coinsRegister = [];
function addToReport(idAndSymbol) {
    var coinSelcted = $(`#${idAndSymbol}`).prop("checked");
    //    var a =  $(`#${idAndSymbol}`).prop("checked", true);
    if (coinsRegister.length == 5) {
        $(`#${idAndSymbol}`).prop("checked", false);
        var changeCoin = idAndSymbol;
        var b = `<div class="modal-content">
        <div class="modal-header">
          <h2>Modal Header</h2>
        </div>
        <div id="coinUpdate"></div>
        <button data-coin="${changeCoin}" id="closeWindowProp">Cancel</button>
        </div>`;
        $('#myModal').html(b);
        for (let i = 0; i < coinsRegister.length; i++) {
            var temp = `<label >${coinsRegister[i]}
                    <input id="${coinsRegister[i]}"  type="checkbox" onclick="updateCoin('${coinsRegister[i]}')">
            </label>`
            $('#coinUpdate').append(temp);
        }

        var modal = document.getElementById('myModal');

        modal.style.display = "block";
        $('#closeWindowProp').click(function (e) {
            e.preventDefault();
            modal.style.display = "none";
        });
    } else {
        if (coinSelcted) {
            coinsRegister.push(idAndSymbol.toUpperCase());
        } else {
            for (let i = 0; i < coinsRegister.length; i++) {
                if (coinsRegister[i] == idAndSymbol.toUpperCase()) {
                    coinsRegister.splice(i, 1);
                }
            }
        }
    }
}

function updateCoin(id) {
    $(`#${id.toLowerCase()}`).prop("checked", false);
    const coinChange = $('#closeWindowProp').attr('data-coin');
    for (let i = 0; i < coinsRegister.length; i++) {
        if (coinsRegister[i] == id) {
            coinsRegister.splice(i, 1);
            coinsRegister.push(coinChange.toUpperCase());
            $(`#${coinChange}`).prop("checked", true);
            document.getElementById('myModal').style.display = "none";
        }
    }
}

$('#ReportsClick').click(() => {
    if (coinsRegister.length == 0) {
        alert('Please select coins');
    } else {
        $('#mainContent').addClass('d-none');
        $('#chartContainer').removeClass('d-none');
        $('#chartContainer').addClass('d-block');

        points = [
            dataPoints1 = [],
            dataPoints2 = [],
            dataPoints3 = [],
            dataPoints4 = [],
            dataPoints5 = []
        ]

        var chart = new CanvasJS.Chart("chartContainer", {
            zoomEnabled: true,
            title: {
                text: "Share Value of Two Companies"
            },
            axisX: {
                title: "chart updates every 2 secs"
            },
            axisY: {
                prefix: "$",
                includeZero: false
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                verticalAlign: "top",
                fontSize: 13,
                fontColor: "dimGrey",
                itemclick: toggleDataSeries
            },
            data: []
        });
        for (let i = 0; i < coinsRegister.length; i++) {
            chart['options']['data'].push({
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "$####.0000",
                showInLegend: true,
                name: coinsRegister[i],
                dataPoints: points[i]
            })
        }

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }

        var updateInterval = 2000;

        // initial value

        $.ajax(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsRegister}&tsyms=USD`)
            .done(function (d) {
                setPrice(d)
            });

        function setPrice(d) {
            var values = [
                yValue1 = 0,
                yValue2 = 0,
                yValue3 = 0,
                yValue4 = 0,
                yValue5 = 0,]
            for (let i = 0; i < coinsRegister.length; i++) {
                if(d[`${coinsRegister[i]}`] !== undefined){
                    var price = d[`${coinsRegister[i]}`]['USD'];
                }else{
                    var price = 0;
                }
                values[i] = price;
            }
        }

        var time = new Date;
        time.getHours();
        time.getMinutes();
        time.getSeconds();
        time.getMilliseconds();
        var yValues = [
            yValue1 = 0,
            yValue2 = 0,
            yValue3 = 0,
            yValue4 = 0,
            yValue5 = 0,]
        function updateChart(count) {
            count = count || 1;
            for (var i = 0; i < count; i++) {
                time.setTime(time.getTime() + updateInterval);
                $.ajax(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsRegister}&tsyms=USD`)
                    .done(function (d) {
                        setYPrice(d)
                    });
                function setYPrice(d) {                    
                    for (let i = 0; i < coinsRegister.length; i++) { 
                         
                        if(d[`${coinsRegister[i]}`] !== undefined){
                            var price = d[`${coinsRegister[i]}`]['USD'];
                        }else{
                            var price = 0;
                        }                      
                        yValues[i] = price;                        
                    }
                    dataPoints1.push({
                        x: time.getTime(),
                        y:yValues[0]
                    });
                    dataPoints2.push({
                        x: time.getTime(),
                        y: yValues[1]
                    }); 
                    dataPoints3.push({
                        x: time.getTime(),
                        y: yValues[2]
                    });
                    dataPoints4.push({
                        x: time.getTime(),
                        y: yValues[3]
                    })
                    ;dataPoints5.push({
                        x: time.getTime(),
                        y: yValues[4]
                    });
                    for(let i = 0; i < coinsRegister.length; i++){
                        chart.options.data[i].legendText = `${coinsRegister[i]} $` + yValues[i];
                    }
                    chart.render();
                }
            }
        }
        // generates first set of dataPoints 
        updateChart(0);
        setInterval(function () { updateChart() }, updateInterval);
    }


});







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
    $("#navBar").removeClass('container');
    $("#navBar").addClass('container-fluid');
    $("#divMenu").removeClass('container');
    $("#divMenu").addClass('container-fluid');
}

