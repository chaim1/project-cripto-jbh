window.onload = function () {
    jQuery('#homeClick').click();
}

var coinArray = [];

$('#mainNav>li>a').click(function (e) {
    $('#mainContent').empty();
    $('#circle').show();
    e.preventDefault();
    const link = $(this).attr('data-link');
    const href = $(this).attr('href');
    $.ajax(`templates/${href}.html`)
        .done(function (htmlData) {
            getData(htmlData, link);
        });
});

const getData = (htmlData, link) => {
    if (coinArray.length == 0) {
        console.log(1);

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
            console.log('coinArray');
        });
    } else {
        console.log(2);
        setData(coinArray, htmlData)
    }
}


var precens = 3;
function setData(coinArray, htmlData) {
    console.log(coinArray);
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
        temp = temp.replace('{simbol}', coinArray[i]['symbol']);
        temp = temp.replace('{name}', coinArray[i]['name']);
        temp = temp.replace(/{collapse}/g, "cl" + coinArray[i]['id']);
        $('#mainContent').append(temp);
    }
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
        console.log($window.scrollTop());
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
