function showModal(msg){
  var modal = $("#modal");
  var error_msg=$("#error_msg");
  error_msg.html(msg);
  modal.modal('show');
}

document.addEventListener('DOMContentLoaded', function() {
  let inputs = document.querySelectorAll('input[data-rule]');
  console.log(inputs);
  for (let input of inputs){
    input.addEventListener('blur', function(){
      let rule = this.dataset.rule;
      let value = this.value;
      let check;
      let pass;
      console.log(value);
      console.log(rule);
      switch (rule) {
        case 'email':
          check = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W\d])$/gm.test(value);
        break;
        case 'name':
          check = value.match(/(^[А-Я]?[а-я]+|^[A-Z]?[a-z]+)|(^[А-Я]+[а-я]*|^[A-Z]+[a-z]*)+$/gm);
        break;
        case 'phone':
          if(value.length - 4 > 0)
            check = true;
          else
            check = false;
        break;
        case 'second_name':
          check = value.match(/(^[А-Я]?[а-я]+|^[A-Z]?[a-z]+)|(^[А-Я]+[а-я]*|^[A-Z]+[a-z]*)+$/gm);
        break;
        case 'third_name':
          check = value.match(/(^[А-Я]?[а-я]+|^[A-Z]?[a-z]+)|(^[А-Я]+[а-я]*|^[A-Z]+[a-z]*)+$/gm);
        break;
        case 'password':
          pass = value;
          if (value.length <= 64 && value.match(/[\d*\w*][^\W]{8,64}$/)){
            check = true;
          }
          else
            check = false;
        break;
        case 'conf_pass':
          let password = document.querySelector('[data-rule="password"]');
          if (password.value == value)
            check = true;
          else
            check = false;
        break;
      }
      console.log(check);
      if (check){
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });
  }
  let btn = document.querySelector('.validate-btn');
  btn.addEventListener('click', function(e){
    let checked = false;
    for (let input of inputs){
      if (input.classList.contains('is-valid'))
        checked = true;
      else
        checked = false;
    }
    if (!checked) {
      e.preventDefault();
    } else {
      e.preventDefault();
      var radio;
      if($(".phys").prop('checked')){
        radio = $(".phys").val();
      }else{
        radio = $(".ur").val();
      }
      $.ajax({
        type: "POST",
        url:  "/register",
        data: {
          email: $(".email").val(),
          name: $(".name").val(),
          second_name: $(".second_name").val(),
          third_name: $(".third_name").val(),
          phone_number: $(".phone").val(),
          password: $(".pass").val(),
          confirm_password: $(".conf_pass").val(),
          customRadioInline1: radio
        },
        success: function(r){
          if(!r.ok){
            showModal(r.error);
          }
          else{
            document.location.href='/shop';
          }
        }
      })
    }
  });
});
