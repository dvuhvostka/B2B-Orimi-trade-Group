var cart = JSON.parse(localStorage.getItem('cart'));

document.addEventListener('DOMContentLoaded', function () {
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "getbalance"},
        success: function(r){
          console.log(r.balance);
          $('#userbalance').html("ВАШ БОНУСНЫЙ БАЛАНС: "+r.balance);
          b = r.balance;
        }
      });
});

window.onload = function(){
  //При загрузке страницы
}
