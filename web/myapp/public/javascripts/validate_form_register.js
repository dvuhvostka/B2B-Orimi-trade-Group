// Example starter JavaScript for disabling form submissions if there are invalid fields
// (function() {
//   'use strict';
//   window.addEventListener('load', function() {
//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.getElementsByClassName('needs-validation');
//     var pass = document.getElementById('validationCustom03');
//     console.log(pass);
//     pass.classList.add('is-invalid')
//     var validation = Array.prototype.filter.call(forms, function(form) {
//       form.addEventListener('submit', function(event) {
//         if (form.checkValidity() === false  ) {
//            event.preventDefault();
//            event.stopPropagation();
//          }
//          form.classList.add('was-validated');
//
//        }, false);
//     });
//
//   }, false);
// })();
function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateInput(email, name, pass, conf, phone){
  flag = true;
  if (name.value.length == 0){
    name.classList.add('is-invalid');
  }else {
    name.classList.remove('is-invalid');
    name.classList.add('is-valid');
    flag = false;
  }
  if (phone.value.length == 0){
    phone.classList.add('is-invalid');
    flag = true;
  } else{
    phone.classList.remove('is-invalid');
    phone.classList.add('is-valid');
    flag = false;
  }
  if (email.value.length == 0){
    email.classList.add('is-invalid');
    flag = true;
  } else if (!emailIsValid(email.value)){
    email.classList.add('is-invalid');
    flag = true;
  }else {
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
    flag = false;
  }
  if (pass.value.length <= 7){
    pass.classList.add('is-invalid');
    flag = true;
  } else{
    pass.classList.remove('is-invalid');
    pass.classList.add('is-valid');
    flag = false;
    if(pass.value != conf.value){
      conf.classList.add('is-invalid');
      flag = true;
    } else{
      conf.classList.remove('is-invalid');
      conf.classList.add('is-valid');
      flag = false;
    }
  }

  return flag;
}


(function(){
  window.addEventListener('load', function(){
    var form = document.querySelector('.needs-validation');
    var validatebtn = document.querySelector('.validate-btn');
    var email = document.querySelector('.email');
    var name = document.querySelector('.name');
    var pass = document.querySelector('.pass');
    var conf_pass = document.querySelector('.conf_pass');
    var phys = document.querySelector('.phys');
    var ur = document.querySelector('.ur');
    var phone = document.querySelector('.phone');
    form.addEventListener('submit', function(event){
      if (validateInput(email, name, pass, conf_pass, phone)){
        event.preventDefault();
        event.stopPropagation();
      }
      console.log(phone.value);
    })
  });
})();
