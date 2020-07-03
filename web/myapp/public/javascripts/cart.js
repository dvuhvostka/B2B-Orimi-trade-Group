var cart = {};

$('document').ready(function() {
  checkCart();
});

$('button.add-to-cart').on('click', addToCart);

function addToCart() {
  var articul = $(this).attr('data-id');
  cart[articul] = 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  console.log(cart);
}

function checkCart() {
  if (localStorage.getItem('cart') != null) {
    cart = JSON.parse(localStorage.getItem('cart'));
  }
}
