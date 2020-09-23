$('.minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() > 1){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
    var input_kor = item.parentsUntil('.footer_item').siblings('.kor').children('.range_items').children('.input');
    var get_box_count = input_kor.attr('box_count');
    input_kor.val(Math.round((item.siblings('.input').val()/get_box_count)*10)/10);
    $("#span_change").html((item.siblings('.input').val()*start_price).toFixed(2));
  } else {
    return 0;
  }
})
$('.plus').on('click', function(){
  var item = $(this);
  if(item.siblings('.input').val()<100){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
    var input_kor = item.parentsUntil('.footer_item').siblings('.kor').children('.range_items').children('.input');
    var get_box_count = input_kor.attr('box_count');
    input_kor.val(Math.round((item.siblings('.input').val()/get_box_count)*10)/10);
    $("#span_change").html((item.siblings('.input').val()*start_price).toFixed(2));
  }
})

var input = document.querySelector('.input');

$('.input').on('change keyup', function(){
  if(parseInt($(this).val()) > 100){
    $(this).val(100);
  } else if (parseInt($(this).val()) < 1){
    $(this).val(1);
  }
    $("#span_change").html(($(this).val()*start_price).toFixed(2));
})
var cart;

if(!localStorage.getItem('cart')){
  cart = {};
} else cart = JSON.parse(localStorage.getItem('cart'));

$('#addtocart').on('click', ()=>{
  var item = $('#addtocart');
  console.log(item);
  var data_id = item.attr('data-id');
  var data_type = item.attr('type');
  console.log(data_id, data_type)
  var input =  item.siblings('.range_items').children('.input');
  var articul = data_type+data_id;
    cart[articul] = input.val();
    localStorage.setItem('cart', JSON.stringify(cart));
    $('.toast').toast('show');
    console.log(cart);
})

window.onload = function() {
  start_price = $('#span_change').html();
  console.log(start_price);
}

$('.box_count_plus').on('click', function(){
  var item = $(this);
  if(item.siblings('.input').val()<100){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
    var input_sht = item.parentsUntil('.footer_item').siblings('.sht').children('.range_items').children('.input');
    input_sht.val(item.attr('box_count')*item.siblings('.input').val());
    $("#span_change").html((input_sht.val()*start_price).toFixed(2));
  }
});

$('.box_count_minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() >= 2){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
    var input_sht = item.parentsUntil('.footer_item').siblings('.sht').children('.range_items').children('.input');
    input_sht.val(item.attr('box_count')*item.siblings('.input').val());
    $("#span_change").html((input_sht.val()*start_price).toFixed(2));
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
