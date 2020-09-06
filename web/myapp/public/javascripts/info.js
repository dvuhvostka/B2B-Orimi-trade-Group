var select = window.location.hash;

document.addEventListener("DOMContentLoaded", function(){
  if (select == '#delivery'){
    var contact__link = document.querySelector('#contact-pill');
    var contacts__div = document.querySelector('#contacts');
    var delivery__link = document.querySelector('#delivery-pill');
    var delivery__div = document.querySelector('#delivery');

    contact__link.classList.remove('active');
    contact__link.setAttribute('aria-selected','false');
    contacts__div.classList.remove('show','active')

    delivery__link.classList.add('active');
    delivery__link.setAttribute('aria-selected','true');
    delivery__div.classList.add('show','active')
  }
})
