$('.minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() > 1){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
    var count = item.siblings('.input').val()*1;
    var setsPrice = item.closest('.amount_wrap').siblings('.item_price_wrap').children('.item_price_wrap').children('.item_price');
    setsPrice.html(Math.round((setsPrice.attr('setsprice')*count)*100)/100+'<svg class="svg-inline--fa fa-ruble-sign fa-w-12" aria-hidden="true" data-prefix="fas" data-icon="ruble-sign" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M239.36 320C324.48 320 384 260.542 384 175.071S324.48 32 239.36 32H76c-6.627 0-12 5.373-12 12v206.632H12c-6.627 0-12 5.373-12 12V308c0 6.627 5.373 12 12 12h52v32H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h52v52c0 6.627 5.373 12 12 12h58.56c6.627 0 12-5.373 12-12v-52H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H146.56v-32h92.8zm-92.8-219.252h78.72c46.72 0 74.88 29.11 74.88 74.323 0 45.832-28.16 75.561-76.16 75.561h-77.44V100.748z"></path></svg>');
  } else {
    return 0;
  }
})
$('.plus').on('click', function(){
  var item = $(this);
  if(item.siblings('.input').val() < 3)
    item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
    var count = item.siblings('.input').val()*1;
    var setsPrice = item.closest('.amount_wrap').siblings('.item_price_wrap').children('.item_price_wrap').children('.item_price');
    setsPrice.html(Math.round((setsPrice.attr('setsprice')*count)*100)/100+'<svg class="svg-inline--fa fa-ruble-sign fa-w-12" aria-hidden="true" data-prefix="fas" data-icon="ruble-sign" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M239.36 320C324.48 320 384 260.542 384 175.071S324.48 32 239.36 32H76c-6.627 0-12 5.373-12 12v206.632H12c-6.627 0-12 5.373-12 12V308c0 6.627 5.373 12 12 12h52v32H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h52v52c0 6.627 5.373 12 12 12h58.56c6.627 0 12-5.373 12-12v-52H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H146.56v-32h92.8zm-92.8-219.252h78.72c46.72 0 74.88 29.11 74.88 74.323 0 45.832-28.16 75.561-76.16 75.561h-77.44V100.748z"></path></svg>');
})
var input_check = $('.sym_none');
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

$('.count_input_pack').on('keyup', function(){
  console.log(3);
  var item = $(this);
  var count = item.val();
  var setsPrice = item.closest('.amount_wrap').siblings('.item_price_wrap').children('.item_price_wrap').children('.item_price');
  setsPrice.html(Math.round((setsPrice.attr('setsprice')*count)*100)/100+'<svg class="svg-inline--fa fa-ruble-sign fa-w-12" aria-hidden="true" data-prefix="fas" data-icon="ruble-sign" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M239.36 320C324.48 320 384 260.542 384 175.071S324.48 32 239.36 32H76c-6.627 0-12 5.373-12 12v206.632H12c-6.627 0-12 5.373-12 12V308c0 6.627 5.373 12 12 12h52v32H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h52v52c0 6.627 5.373 12 12 12h58.56c6.627 0 12-5.373 12-12v-52H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H146.56v-32h92.8zm-92.8-219.252h78.72c46.72 0 74.88 29.11 74.88 74.323 0 45.832-28.16 75.561-76.16 75.561h-77.44V100.748z"></path></svg>');
});

$('.item_btn_addToCart').on('click', function(){
  var item = $(this);
  var count = item.closest('div.item_price_wrap').siblings('.amount_wrap').children('.range_items').children('.input').val();
  var articul = 'sets'+item.attr('set-id');
  if(!localStorage.getItem('cart')){
    var cart = {};
  } else var cart = JSON.parse(localStorage.getItem('cart'));
  cart[articul] = count;
  localStorage.setItem('cart', JSON.stringify(cart));
  $.ajax({
    type: 'POST',
    url: '/order',
    data: {post_type: "getcartcost", cart: localStorage.getItem('cart')},
    success: function(r){
        if(r.ok){
          showModal('Товар успешно добавлен в корзину.','Успешно');
        }else{
          delete cart[articul];
          localStorage.setItem('cart', JSON.stringify(cart));
          showModal(r.error, 'Ошибка');
        }
  }});
});
