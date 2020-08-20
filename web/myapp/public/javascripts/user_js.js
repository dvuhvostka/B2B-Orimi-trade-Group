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
  $.mask.definitions['r'] = "[а-яА-яЁё]";
  $("#inn").click(function(){
    $(this).setCursorPosition(0);
  }).mask("9999999999",{autoclear: false, placeholder: ''});
  $("#phone_input").mask("9999",{placeholder: '_'});
});
document.addEventListener('DOMContentLoaded', ready);
