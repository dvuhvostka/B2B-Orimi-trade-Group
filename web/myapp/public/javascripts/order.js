var cart = JSON.parse(localStorage.getItem('cart'));

document.addEventListener('DOMContentLoaded', function () {
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "getbalance"},
        success: function(r){
          $('#userbalance').html("ВАШ БОНУСНЫЙ БАЛАНС: "+r.balance);
          b = r.balance;
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
            $('#cartcost').html("СУММА ЗАКАЗА: "+r.fullcost);
          }
        }
      });
});

window.onload = function(){
  //При загрузке страницы
  $('#delivery_info').on('submit', (e)=>{
    e.preventDefault();
    if(localStorage.getItem('cart')){
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "delivery_info", formdata: $('#delivery_info').serialize(), cart: localStorage.getItem('cart')},
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
