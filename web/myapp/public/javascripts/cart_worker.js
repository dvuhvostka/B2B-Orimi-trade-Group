var cart = {}

$('document').ready(function() {
  checkCart();
});

function checkCart() {
  if (localStorage.getItem('cart') != null) {
    cart = JSON.parse(localStorage.getItem('cart'));
  }
}
function inc() {
  var articul = $(this).attr('atr_id');
  if(cart[articul]!=undefined){
    cart[articul]++
    localStorage.setItem('cart', JSON.stringify(cart));
    var count = $("div.count_num[atr_id="+articul+"]");
    var price_num = $("div.price_num[atr_id="+articul+"]");
    var price_one = $("div.price_num[atr_id="+articul+"]").attr('price_one');
    count.html(+count.text()+1);
    price_num.html(+price_one*(+count.text()));
  };
}

function dec() {
  var articul = $(this).attr('atr_id');
  if(cart[articul]>1){
    cart[articul]--
    localStorage.setItem('cart', JSON.stringify(cart));
    var count = $("div.count_num[atr_id="+articul+"]");
    var price_one = $("div.price_num[atr_id="+articul+"]").attr('price_one');
    var price_num = $("div.price_num[atr_id="+articul+"]");
    count.html(+count.text()-1);
    price_num.html(+price_one*(+count.text()));
  }else{
    delete cart[articul];
    localStorage.setItem('cart', JSON.stringify(cart));
    var block = $("div.product_cart_container[atr_id="+articul+"]");
    block.detach();
  }
}


if (localStorage.getItem('cart') != null) {
  cart = JSON.parse(localStorage.getItem('cart'));
  $.ajax({
    type: "POST",
    url: "/cart",
    data: cart,
    success: function(msg){
      var out = '';
      for (var w in msg) {
        out+= "<div atr_id='"+msg[w].id+"' class='product_cart_container'><p class='name'> Название: "+msg[w].name+"</p>"+"<div class='price'> Цена: <div class='price_num' price_one='"+msg[w].price+"' atr_id='"+msg[w].id+"'>"+msg[w].price*msg[w].count+"</div></div>"+"<div atr_id='"+msg[w].id+"' class='count'> Количество: <div class='count_num' atr_id='"+msg[w].id+"'>"+msg[w].count+"</div> <button atr_id='"+msg[w].id+"' class='inc'>+</button><button atr_id='"+msg[w].id+"' class='dec'>-</button></div></div>";
      };
      $('.container').html(out);
      $('button.inc').on('click', inc);
      $('button.dec').on('click', dec);
    }
  });
}
