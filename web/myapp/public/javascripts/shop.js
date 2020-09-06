var modal_city = $("#modal_city");
var msg=$("#city");

function showModalCity(mssg){
  msg.html(mssg);
  modal_city.modal('show');
}
  window.onload = function(){
    getRegion();
  $("#select_city").select2({
    data: array,
  })

  var range_price = document.getElementById('range_price');
  var input_range_price = document.getElementById('input_range_price');
  var range_weight = document.getElementById('range_weight');
  var input_range_weight = document.getElementById('input_range_weight');

  range_price.addEventListener('mousemove', function(){
    input_range_price.value = range_price.value;
  });
  input_range_price.addEventListener('change', function(){
    range_price.value = input_range_price.value;
  });
  range_weight.addEventListener('mousemove', function(){
    input_range_weight.value = range_weight.value;
  });
  input_range_weight.addEventListener('change', function(){
    range_weight.value = input_range_weight.value;
  });
}
var params={};
window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {params[key] = value;});
for (key in params) {
  var input = document.getElementsByName(key)[0];
    if (key=="range_of_price"){input.value = params[key]; var input2 = document.getElementById('input_range_price'); input2.value = params[key];}
    if (key=="weight"){input.value = params[key]; var input3 = document.getElementById('input_range_weight'); input3.value = params[key];}
  input.checked = !0;
  console.log(input);
}

function check_cereal(){
  var cereal = document.getElementsByName('cereal')[0];
  var cereal_2 = document.getElementsByName('cereal_2')[0];
  var cereal_3 = document.getElementsByName('cereal_3')[0];
  var cereal_4 = document.getElementsByName('cereal_4')[0];
  if((cereal_2.checked == true)||(cereal_3.checked == true)||(cereal_4.checked == true)){
    cereal.checked = !0;
  }
  if((cereal_2.checked == false)&&(cereal_3.checked == false)&&(cereal_4.checked == false)){
    cereal.checked = 0;
  }
}

function check_milled(){
  var milled = document.getElementsByName('milled')[0];
  var milled_2 = document.getElementsByName('milled_2')[0];
    milled.checked = !0;
}

function check_black(){
  var black = document.getElementsByName('black')[0];
  var black_1 = document.getElementsByName('black_1')[0];
    black.checked = !0;
}

function check_green(){
  var green = document.getElementsByName('green')[0];
  var green_1 = document.getElementsByName('green_1')[0];
    green.checked = !0;
}

$('.minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() > 1){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
  } else {
    return 0;
  }
})
$('.plus').on('click', function(){
  var item = $(this);
  item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
})

$('.kor .range_items .input').on('change',function(){
  var item = $(this);
  var input_sht = item.parentsUntil('.footer_item').siblings('.sht').children('.range_items').children('.input');
  input_sht.val(item.attr('box_count')*item.val());
})

if(!localStorage.getItem('cart')){
  var cart = {};
} else cart = JSON.parse(localStorage.getItem('cart'));


$('.box_count_plus').on('click', function(){
  var item = $(this);
  item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
  var input_sht = item.parentsUntil('.footer_item').siblings('.sht').children('.range_items').children('.input');
  input_sht.val(item.attr('box_count')*item.siblings('.input').val());
});

$('.box_count_minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() > 0){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
    var input_sht = item.parentsUntil('.footer_item').siblings('.sht').children('.range_items').children('.input');
    input_sht.val(item.attr('box_count')*item.siblings('.input').val());
  } else {
    return 0;
  }
});

var input_check = $('.input');
  for(let each of input_check){
    each.onkeypress=function(e){
      e = e || event;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      var chr = String.fromCharCode(e.which);
      if (chr == null) return;
      if (chr < '0' || chr > '9') {
        return false;
      }
    }
  }

$('.addtocart').on('click', function(){
  var item = $(this);
  var data_id = item.attr('data-id');
  var data_type = item.attr('type');
  var input =  item.siblings('.sht').children('.range_items').children('.input');
  var articul = data_type+data_id;
    cart[articul] = input.val();
    localStorage.setItem('cart', JSON.stringify(cart));
    $('.toast').toast('show');
    console.log(cart);
})
var region_edited =0;
var region_selected;
function getRegion() {
  let region = localStorage.getItem('reg');
  if(region==undefined){
    $.get( "https://freegeoip.app/json/", function( data ) {
      //console.log(data);
      //alert(data.region_name+"\n"+data.ip);
      switch(data.region_name){
        case "Москва": region_selected = 77; break;
        case "Санкт-Петербург": region_selected = 78; break;
        case "Новосибирск": region_selected = 54; break;
        case "Екатеринбург": region_selected = 66; break;
        case "Нижний Новгород": region_selected = 52; break;
        case "Казань": region_selected = 116; break;
        case "Челябинск": region_selected = 74; break;
        case "Омск": region_selected = 55; break;
        case "Самара": region_selected = 63; break;
        case "Ростов-на-Дону": region_selected = 61; break;
        case "Уфа": region_selected = 02; break;
        case "Красноярск": region_selected = 24; break;
        case "Воронеж": region_selected = 736; break;
        case "Пермь": region_selected = 59; break;
        case "Волгоград": region_selected = 34; break;
        case "Краснодар": region_selected = 123; break;
        case "Саратов": region_selected = 64; break;
        default: region_selected = 77; break;
      }
      showModalCity(
        "Ваш город: "+data.region_name+"? "
      );
    });
  }else{
    //дописать вывод города
  }
}
$('#region_edited').on('click', function(){
  if(region_edited == 0){
    region_edited = 1
    console.log(region_edited);
  }else{
    region_edited = 0;
    console.log(region_edited);
  }
});
$('#accept_region').on('click', function(){
  if(region_edited==0){
    localStorage.setItem('reg', region_selected);
  }else if(region_edited == 1){
    switch($('#select2-select_city-container').attr('title')){
      case "Москва и Московская область": region_selected = 77; break;
      case "Санкт Петербург и Ленинградская область": region_selected = 78; break;
      case "Новосибирск": region_selected = 54; break;
      case "Екатеринбург": region_selected = 66; break;
      case "Нижний Новгород": region_selected = 52; break;
      case "Казань": region_selected = 116; break;
      case "Челябинск": region_selected = 74; break;
      case "Омск": region_selected = 55; break;
      case "Самара": region_selected = 63; break;
      case "Ростов-на-Дону": region_selected = 61; break;
      case "Уфа": region_selected = 02; break;
      case "Красноярск": region_selected = 24; break;
      case "Воронеж": region_selected = 736; break;
      case "Пермь": region_selected = 59; break;
      case "Волгоград": region_selected = 34; break;
      case "Краснодар": region_selected = 123; break;
      case "Саратов": region_selected = 64; break;
      default: region_selected = 77; break;
    }
    localStorage.setItem('reg', region_selected);
  }
});
