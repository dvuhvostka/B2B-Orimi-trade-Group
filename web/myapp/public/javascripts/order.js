var cart = JSON.parse(localStorage.getItem('cart'));
var options = { id : 'js-AddressField' };
AhunterSuggest.Address.Solid( options );
document.addEventListener('DOMContentLoaded', function () {
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "getbalance"},
        success: function(r){
          $('#userbalance').html("Ваш бонусный баланс: "+r.balance+" бонуса(ов)");
          $('.bonuses__input').attr('placeholder',r.balance)
          b = r.balance;
          $('.bonuses__input').on('change',()=>{
            if(Number($('.bonuses__input').val()) > r.balance){
            $('.bonuses__input').val(r.balance);
            }
          });
        }
      });
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "getcartcost", cart: localStorage.getItem('cart')},
        success: function(r){
          if(!r.ok){
            switch(r.error){
              case "ERROR_CART_EMPTY": document.location.href='/shop'; break;
              default: document.location.href='/shop'; break;
            }
          }else {
            $('.price').html(r.fullcost+' ');
            $('.order__final_price').html(Math.round((r.fullcost)*100)/100+' ');
          }
          var price = Number($('.order__final_price').html());
          if(price < 2000){
            $('.order_min').removeClass('d-none');
          } else {
            $('.order_min').addClass('d-none');
          }
          $('.bonuses__input').on('change',()=>{
            var bonuses = $('.bonuses__input').val();
            $('.order__final_price').html(Math.round((price-(bonuses))*100)/100+' ');
            if(price-(bonuses) < 2000){
              $('.order_min').removeClass('d-none');
            } else {
              $('.order_min').addClass('d-none');
            }
          });
        }
      });
});

window.onload = function(){
  var region,reg;
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
  if(localStorage.getItem('reg')){
    region = localStorage.getItem('reg');
    for (var i=0; i<array.length; i++){
      if (array[i].id == region) reg = array[i].text;
    }
    $('#js-AddressField').val(reg+', ');
  }
  $('.checkbox_bonuses').on('change',()=>{
    if ($('.checkbox_bonuses').prop('checked')){
      $('.bonuses__input').removeAttr('disabled')
    } else {
      $('.bonuses__input').attr('disabled',true)
    }
  });
  //При загрузке страницы
  $('#delivery_info').on('submit', (e)=>{
    e.preventDefault();
    var region = 0;

    if(localStorage.getItem('cart')){
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "delivery_info", formdata: $('#delivery_info').serialize(), cart: localStorage.getItem('cart'), region: localStorage.getItem('reg')},
        success: function(r){
          switch(r.ok){
            case true: showModal(r.message,'Заказ оформлен', true, '/shop'); localStorage.removeItem('cart'); break;
            case false: console.log(r.error); break;
            default: window.location.href = '/shop'; break;
          }
        }
      });
    }else{
      showModal('Корзина пуста','Ошибка', true);
    }
  })
}
