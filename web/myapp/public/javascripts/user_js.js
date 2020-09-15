function deals(){
  document.querySelector('.spinner-border').classList.add('d-none');
  document.querySelector('#deals').classList.remove('d-none');
}
function ready(){
  var a = document.querySelector('#nav-orders-tab');
  a.addEventListener('click', function(){
    setTimeout(deals,3000);
  });

  var input = document.querySelector('#docs');
  var label = input.nextElementSibling,
      labelValue = label.innerHTML;
  console.log(labelValue);
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
  var plus = document.querySelector('.add__addres');
  plus.addEventListener('click', function(event){
    var inputs = document.querySelectorAll('input[data-addres-id]');
    var newDiv = document.createElement('div');
    var target = event.currentTarget;
    var number = inputs[inputs.length-1].getAttribute('data-addres-id');
    newDiv.className = "in add_addres_wrap";
    newDiv.innerHTML = "<input type='text' name='org_address_fact[]' required "
    +"placeholder='Фактический адрес организации' data-addres-id="+(Number(number)+1)+" class='org_address_fact'>"
    +"<a class='remove__addres btn'><i class='fas fa-minus minus_btn'></i></a>";
    var prevElem = inputs[inputs.length-1].parentNode;
    prevElem.after(newDiv);
    var lastInput = document.querySelectorAll('input[data-addres-id]');
    console.log(lastInput[lastInput.length-1].nextSibling);
    lastInput[lastInput.length-1].nextSibling.addEventListener('click', (e)=>{
      var parent = e.currentTarget.parentNode;
      parent.remove();
    })
  });
  var select = document.querySelector('.type_of_org')
  select.addEventListener('change',(e)=>{
    var value = e.currentTarget.value;
    console.log(value);
    if (value == 'Другое') {
      var input = document.createElement('input');
      input.className = 'custom_type';
      input.setAttribute('placeholder','Укажите тип вашей организации');
      input.setAttribute('required', 'true');
      e.currentTarget.after(input);
    } else {
      var showText = document.querySelector('.custom_type');
      if (showText){
        showText.remove();
      }
    }
  });
}
