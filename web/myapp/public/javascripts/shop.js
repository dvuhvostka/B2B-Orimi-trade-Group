var modal_city = $("#modal_city");
var msg=$("#city");

function showModalCity(mssg){
  msg.html(mssg);
  modal_city.modal('show');
}

document.addEventListener('DOMContentLoaded', ()=>{
    $('#page0').removeClass('d-none');
    var page_li_bottom = document.querySelectorAll('.bot .pagenumber');
    console.log(page_li_bottom);
    var page_li_top = document.querySelectorAll('.top .pagenumber');
    page_li_top[0].classList.add('active');
    page_li_bottom[0].classList.add('active');

    $('.top .nextpage').on('click',(e)=>{
      e.preventDefault();
      item = e.currentTarget;

      var root = item.parentNode.parentNode;
      var current_page_link = root.querySelector('.active');
      var current_page_number = Number(current_page_link.querySelector('[data-id]').getAttribute('data-id'));
      var current_page = document.querySelector('#page'+current_page_number);

      var next_page_number = current_page_number + 1;
      var next_page_link = root.querySelector('[data-id="'+next_page_number+'"]').parentNode;
      var next_page = document.querySelector('#page'+next_page_number);

      var bot_nav = document.querySelector('.pagination.bot');
      var current_page_link_bot = bot_nav.querySelector('.active');
      var next_page_link_bot = bot_nav.querySelector('[data-id="'+next_page_number+'"]').parentNode;

      current_page_link.classList.remove('active');
      current_page_link_bot.classList.remove('active');
      current_page.classList.add('d-none');
      next_page_link_bot.classList.add('active');
      next_page_link.classList.add('active');
      next_page.classList.remove('d-none');
    });
    $('.bot .nextpage').on('click',(e)=>{
      e.preventDefault();
      item = e.currentTarget;

      var root = item.parentNode.parentNode;
      var current_page_link = root.querySelector('.active');
      var current_page_number = Number(current_page_link.querySelector('[data-id]').getAttribute('data-id'));
      var current_page = document.querySelector('#page'+current_page_number);

      var next_page_number = current_page_number + 1;
      var next_page_link = root.querySelector('[data-id="'+next_page_number+'"]').parentNode;
      var next_page = document.querySelector('#page'+next_page_number);

      var top_nav = document.querySelector('.pagination.top');
      var current_page_link_top = top_nav.querySelector('.active');
      var next_page_link_top = top_nav.querySelector('[data-id="'+next_page_number+'"]').parentNode;

      current_page_link.classList.remove('active');
      current_page_link_top.classList.remove('active');
      current_page.classList.add('d-none');
      next_page_link_top.classList.add('active');
      next_page_link.classList.add('active');
      next_page.classList.remove('d-none');
    });


    $('.top .prevpage').on('click',(e)=>{
      e.preventDefault();
      item = e.currentTarget;

      var root = item.parentNode.parentNode;
      var current_page_link = root.querySelector('.active');
      var current_page_number = Number(current_page_link.querySelector('[data-id]').getAttribute('data-id'));
      var current_page = document.querySelector('#page'+current_page_number);
      if (current_page_number > 0){

        var prev_page_number = current_page_number - 1;
        var prev_page_link = root.querySelector('[data-id="'+prev_page_number+'"]').parentNode;
        var prev_page = document.querySelector('#page'+prev_page_number);

        var bot_nav = document.querySelector('.pagination.bot');
        var current_page_link_bot = bot_nav.querySelector('.active');
        var prev_page_link_bot = bot_nav.querySelector('[data-id="'+prev_page_number+'"]').parentNode;

        current_page_link.classList.remove('active');
        current_page_link_bot.classList.remove('active');
        current_page.classList.add('d-none');
        prev_page_link_bot.classList.add('active');
        prev_page_link.classList.add('active');
        prev_page.classList.remove('d-none');
      }
    });
    $('.bot .prevpage').on('click',(e)=>{

      e.preventDefault();
      item = e.currentTarget;

      var root = item.parentNode.parentNode;
      var current_page_link = root.querySelector('.active');
      var current_page_number = Number(current_page_link.querySelector('[data-id]').getAttribute('data-id'));
      var current_page = document.querySelector('#page'+current_page_number);
      if (current_page_number > 0){

        var prev_page_number = current_page_number - 1;
        var prev_page_link = root.querySelector('[data-id="'+prev_page_number+'"]').parentNode;
        var prev_page = document.querySelector('#page'+prev_page_number);

        var top_nav = document.querySelector('.pagination.top');
        var current_page_link_top = top_nav.querySelector('.active');
        var prev_page_link_top = top_nav.querySelector('[data-id="'+prev_page_number+'"]').parentNode;

        current_page_link.classList.remove('active');
        current_page_link_top.classList.remove('active');
        current_page.classList.add('d-none');
        prev_page_link_top.classList.add('active');
        prev_page_link.classList.add('active');
        prev_page.classList.remove('d-none');

      }
    });

    $('.pagenumber').on('click',(e)=>{
      var item = e.currentTarget;
      var root = item.parentNode;
      if (root.classList.contains('top')){
        var second_root = document.querySelector('.bot');
      } else {
        var second_root = document.querySelector('.top');
      }
      if (!item.classList.contains('active')) {
        var current_page_link = root.querySelector('.active');
        var current_page_link_second = second_root.querySelector('.active');
        var current_page_number = Number(current_page_link.querySelector('[data-id]').getAttribute('data-id'));
        var current_page = document.querySelector('#page'+current_page_number);

        var new_page_link = item;
        var new_page_number = Number(new_page_link.querySelector('[data-id]').getAttribute('data-id'));
        var new_page_link_second = second_root.querySelector('[data-id="'+new_page_number+'"]').parentNode;
        var new_page = document.querySelector('#page'+new_page_number);

        current_page_link.classList.remove('active');
        current_page_link_second.classList.remove('active');
        current_page.classList.add('d-none');

        new_page_link.classList.add('active');
        new_page_link_second.classList.add('active');
        new_page.classList.remove('d-none');
      }
    })
});

  window.onload = function(){
    $('.btn-help').on('click', function(){
      var help = document.querySelector('.gethelp_wrap');
      var overlay = document.querySelector('.gethelp_overlay');
      help.classList.add('visible');
      overlay.classList.remove('d-none');
    })
    $('.gethelp_overlay').on('click', function() {
      var help = document.querySelector('.gethelp_wrap');
      var overlay = document.querySelector('.gethelp_overlay');
      help.classList.remove('visible');
      overlay.classList.add('d-none');
    });

    getRegion();
  $("#select_city").select2({
    data: array,
  })

  $('.count_input_pack').on('keyup', function(){
    var item = $(this);
    if(item.val()>1000){
      item.val(1000);
    }
  });

  $('.count_input_box').on('keyup', function(){
    var item = $(this);
    if(item.val()>100){
      item.val(100);
    }
  });

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
  range_price.addEventListener('touchmove', function(){
    input_range_price.value = range_price.value;
  });
  range_price.addEventListener('touchend', function(){
    input_range_price.value = range_price.value;
  });
  range_weight.addEventListener('mousemove', function(){
    input_range_weight.value = range_weight.value;
  });
  range_weight.addEventListener('touchmove', function(){
    input_range_weight.value = range_weight.value;
  });
  range_weight.addEventListener('touchend', function(){
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
  var input = item.siblings('.input');
  var other = input.hasClass('count_others')
  if (item.siblings('.input').val() > 1 && !other){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
    var input_kor = item.parentsUntil('.footer_item').siblings('.kor').children('.range_items').children('.input');
    var get_box_count = input_kor.attr('box_count');
    input_kor.val(Math.round((item.siblings('.input').val()/get_box_count)*10)/10);
  } else if (other){
    console.log(1234);
      var get_box_count = parseInt(input.attr('box_count'));

      if(item.siblings('.input').val() >= get_box_count ){
        
        item.siblings('.input').val(parseInt(item.siblings('.input').val())-get_box_count);

      }

  } else {
    return 0;
  }
})
$('.plus').on('click', function(){
  var item = $(this);
  var input = item.siblings('.input');
  var other = input.hasClass('count_others')
  if(item.siblings('.input').val()<1000 && !other){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
    var input_kor = item.parentsUntil('.footer_item').siblings('.kor').children('.range_items').children('.input');
    var get_box_count = input_kor.attr('box_count');
    input_kor.val(Math.round((item.siblings('.input').val()/get_box_count)*10)/10);
  } else if (other){

      var get_box_count = parseInt(input.attr('box_count'));
      if(item.siblings('.input').val() <= get_box_count*1000){

        item.siblings('.input').val(parseInt(item.siblings('.input').val())+get_box_count);

      }

  }
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
  if(item.siblings('.input').val()<100){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
    var input_sht = item.parentsUntil('.footer_item').siblings('.sht').children('.range_items').children('.input');
    input_sht.val(item.attr('box_count')*item.siblings('.input').val());
  }
});

$('.box_count_minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() >= 1){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
    var input_sht = item.parentsUntil('.footer_item').siblings('.sht').children('.range_items').children('.input');
    input_sht.val(item.attr('box_count')*item.siblings('.input').val());
  } else {
    return 0;
  }
});

$('.count_input_pack').on('change paste keyup',function(){
  var item = $(this);
  var input_kor = item.parentsUntil('.footer_item').siblings('.kor').children('.range_items').children('.input');
  var get_box_count = input_kor.attr('box_count');
  input_kor.val(Math.round((item.val()/get_box_count)*10)/10);
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
