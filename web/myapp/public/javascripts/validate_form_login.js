function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function xss_check(replace){
  var pattern = /script|javascript|src|onerror|%|<|>/g;
  if(replace.name.search(pattern)<0 && replace.email.search(pattern)<0) return false; else return true;
}

function validateInput(email, pass){
  flag = true;
  if(emailIsValid(email.value)){
    email.classList.remove('is-invalid');
    email.classList.add('is-valid');
    flag = false;
  } else {
    email.classList.remove('is-valid');
    email.classList.add('is-invalid');
    flag = true;
  }
  if (pass.value.length > 7){
    pass.classList.remove('is-invalid');
    pass.classList.add('is-valid');
    flag = false;
  } else{
    pass.classList.remove('is-valid');
    pass.classList.add('is-invalid');
    flag = true;
  }
  return flag;
}

(function(){
  window.addEventListener('load', function(){
    var form = document.querySelector('#form_input_by_client')
    var email = document.querySelector('.email');
    var pass = document.querySelector('.password');
    form.addEventListener('submit', function(event){
      if (validateInput(email, pass)){
        event.preventDefault();
        event.stopPropagation();
      }
    })
    var button = document.querySelector('button[type="submit"]');
    button.addEventListener('click',function(e){
      e.preventDefault();
      $.ajax({
        url: "/login",
        type:"POST",
        data: {
          email: $(".email").val(),
          password: $(".password").val()
        },
        success: function(r){
          if(!r.ok)
            showModal(r.error);
          else
            document.location.href='/shop';
        }
      })
    });
  });
})();
