$('.minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() > 1){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
    $("#span_change").html((item.siblings('.input').val()*start_price).toFixed(2));
  } else {
    return 0;
  }
})

$('.plus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() < 100){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
    $("#span_change").html((item.siblings('.input').val()*start_price).toFixed(2));
  } else {
    return 0;
  }
})
var input = document.querySelector('.input');

$('.input').on('change', function(){
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
