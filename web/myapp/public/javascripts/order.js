var cart = JSON.parse(localStorage.getItem('cart'));

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
              case "ERROR_CART_EMPTY": $('#cartcost').html("ВАША КОРЗИНА ПУСТА"); break;
              default: console.log(r.arg); break;
            }
          }else {
            $('.price').html(r.fullcost+' ');
            $('.order__final_price').html(r.fullcost+' ');
          }
          var price = Number($('.order__final_price').html());
          $('.bonuses__input').on('change',()=>{
            var bonuses = $('.bonuses__input').val();
            $('.order__final_price').html(price-(bonuses/10)+' ');
            if(price-(bonuses/10) < 2000){
              $('.order_min').removeClass('d-none');
            } else {
              $('.order_min').addClass('d-none');
            }
          });
        }
      });
});

window.onload = function(){
  if(localStorage.getItem('reg')){
    var region = 0;
    for (var i=0; i<array.length; i++){
      if (array[i].id == localStorage.getItem('reg')) region = array[i].text;
    }
    $('#input_addr').val(region+', ');
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

    if(localStorage.getItem('reg')){
      region = localStorage.getItem('reg');
    }

    if(localStorage.getItem('cart')){
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "delivery_info", formdata: $('#delivery_info').serialize(), cart: localStorage.getItem('cart'), region},
        success: function(r){
          switch(r.ok){
            case true: alert(r.message); localStorage.removeItem('cart'); window.location.href='/user'; break;
            case false: console.log(r.error); break;
            default: window.location.href = '/shop'; break;
          }
        }
      });
    }else{
      alert('Корзина пуста');
    }
  })
}
