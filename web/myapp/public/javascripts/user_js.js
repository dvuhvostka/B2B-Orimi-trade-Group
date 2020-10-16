function deals(){
  document.querySelector('.spinner-border').classList.add('d-none');
  document.querySelector('#deals').classList.remove('d-none');
}
function ready(){
  var dog = document.querySelector('#ready_doc');
  dog.addEventListener('click', (e)=>{
    var id = e.currentTarget.getAttribute('data-id');
    $.ajax({
      type: "GET",
      url: "/user",
      data: {
        id: id
      },
      success: (res)=>{
        window.location.href = res;
      }
    });
  });

  var a = document.querySelector('#nav-orders-tab');
  a.addEventListener('click', function(){
    setTimeout(deals,3000);
  });

  var options = { id : 'js-AddressField' };
  AhunterSuggest.Address.Solid( options );

  var input = document.querySelector('#docs');
  var label = input?input.nextElementSibling:'',
      labelValue = label.innerHTML;
  console.log(labelValue);
  if (input)
    input.addEventListener('change', function(e){
      var fileName = '';
      console.log(this.files);
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}',this.files.length);
      else
        fileName = this.files[0].name;

      if (fileName)
        label.querySelector('span').innerHTML = fileName;
      else
        label.innerHTML = labelValue;
    });
    var input_photo = document.querySelector('#photo');
    var label_photo = input_photo?input_photo.nextElementSibling:'',
        label_photo_value = label_photo?label_photo.innerHTML:'';
    if (input_photo)
    input_photo.addEventListener('change', function(e){
      var fileName = '';
      console.log(this.files);
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}',this.files.length);
      else
        fileName = this.files[0].name;

      if (fileName)
        label_photo.querySelector('span').innerHTML = fileName;
      else
        label_photo.innerHTML = label_photo_value;
    });
    var input_cheque = document.querySelector('#cheque');
    var label_cheque = input_cheque?input_cheque.nextElementSibling:'',
        label_cheque_value = label_cheque?label_cheque.innerHTML:'';
    if (input_cheque)
    input_cheque.addEventListener('change', function(e){
      var fileName = '';
      console.log(this.files);
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}',this.files.length);
      else
        fileName = this.files[0].name;

      if (fileName)
        label_cheque.querySelector('span').innerHTML = fileName;
      else
        label_cheque.innerHTML = label_photo_value;
    });
}
$.fn.setCursorPosition = function(pos) {
  if ($(this).get(0).setSelectionRange) {
    $(this).get(0).setSelectionRange(pos, pos);
  } else if ($(this).get(0).createTextRange) {
    var range = $(this).get(0).createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
};
$(function($){
  $("#inn").click(function(){
    $(this).setCursorPosition(0);
  }).mask("9999999999",{autoclear: false, placeholder: ''});
});

document.addEventListener('DOMContentLoaded', ready);

window.onload = function() {
  $('.password_change').on('submit', (e)=>{
    e.preventDefault();
    var inputs = $('.pass_input');
    var data = {};
    for(let each of inputs){
      var name, value;
      name = each.name;
      value = each.value;
      data[name] = value;
    }
    $.ajax({
      type: "POST",
      url: "/user",
      data: {
        data: data,
        post_type: "change_pass"
      },
      success: (data) => {
        switch(data.ok){
          case true: showModal("Вы успешно сменили пароль.", "Успех", true, "/user"); break;
          case false: showModal(data.error, "Ошибка", false);
        }
      }
    });
  });
  var plus = document.querySelector('.add__addres');
  console.log(plus);
  plus.addEventListener('click', function(e){
    console.log(123);
    var inputs = document.querySelectorAll('input[data-addres-id]');
    var newDiv = document.createElement('div');
    var target = e.currentTarget;
    var value = target.previousSibling.value;
    console.log(value);
    var number = inputs[inputs.length-1].getAttribute('data-addres-id');
    newDiv.className = "in add_addres_wrap";
    newDiv.innerHTML = "<input type='text' name='org_address_fact[]' required "
    +"placeholder='Фактический адрес организации' data-addres-id="+(Number(number)+1)+" class='org_address_fact js-AddressField' value='"+value+"'>"
    +"<a class='remove__addres btn'><i class='fas fa-minus minus_btn'></i></a>";
    var prevElem = inputs[inputs.length-1].parentNode;
    prevElem.after(newDiv);
    target.previousSibling.value = '';
    var lastInput = document.querySelectorAll('input[data-addres-id]');
    console.log(lastInput[lastInput.length-1].nextSibling);
    lastInput[lastInput.length-1].nextSibling.addEventListener('click', (e)=>{
      var parent = e.currentTarget.parentNode;
      parent.remove();
    })
  });
  var select = document.querySelector('.type_of_org');
  if (select)
    select.addEventListener('change',(e)=>{
      var value = e.currentTarget.value;
      console.log(value);
      if (value == 'Другое') {
        var input = document.createElement('input');
        input.className = 'custom_type';
        input.setAttribute('placeholder','Укажите тип вашей организации');
        input.setAttribute('required', 'true');
        input.setAttribute('name', 'custom_type');
        e.currentTarget.after(input);
      } else {
        var showText = document.querySelector('.custom_type');
        if (showText){
          showText.remove();
        }
      }
    });
}
