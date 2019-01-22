
//https://api.coingecko.com/api/v3/coins/list
var coinArray = [];

$('#mainNav>li>a').click(function (e) {
    e.preventDefault();
    const href = $(this).attr('href');
    $.ajax(`templates/${href}.html`)
        .done(function (htmlData) {
            if(coinArray.length == 0){
                $.ajax({
                    url: `demo.json`,
                    method: 'GET'
                }).done(function (d) {
                    if (typeof d === 'string')
                        d = JSON.parse(d);
                        for(let i = 0; i < d.length; i++){
                            coinArray.push(d[i]);
                        }
                        setData(coinArray, htmlData)
                        console.log('coinArray');
                });
            }else{
                setData(coinArray, htmlData)
            }
        });
});

function setData(coinArray, htmlData){
    console.log(coinArray);
    
    for (let i = 0; i < coinArray.length; i++) {
        // console.log(coinArray[i]['name']);
        var temp = htmlData;
        temp = temp.replace('{simbol}', coinArray[i]['symbol']);
        temp = temp.replace('{name}', coinArray[i]['name']);
        temp = temp.replace(/{collapse}/g, "cl"+coinArray[i]['id']);
        $('#mainContent').append(temp);
    }
}






//css dynamic

var width = window.innerWidth;
var height = window.innerHeight;


$window = $(window);
var positionNav = $( "#header-nav" ).offset();
var heightNav = $( "#header-nav" ).height();
$window.scroll(function (e) {
    let lastPosition = window.scrollY;

    if ($window.scrollTop() > positionNav.top) {
        console.log($window.scrollTop());
        $( "#header-nav" ).addClass('fixed-top')
        $( "#mainContent" ).css({marginTop: heightNav})
    } else {
        $( "#header-nav" ).removeClass('fixed-top')
        $( "#mainContent" ).css({marginTop: '0'})
    }
});



if(width<1100){
    $( "#navBar" ).removeClass('container')
    $( "#navBar" ).addClass('container-fluid')
    $( "#divMenu" ).removeClass('container')
    $( "#divMenu" ).addClass('container-fluid')
}


