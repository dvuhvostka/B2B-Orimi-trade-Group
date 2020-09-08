$('.minus').on('click', function(){
  var item = $(this);
  if (item.siblings('.input').val() > 1){
    item.siblings('.input').val(parseInt(item.siblings('.input').val())-1);
  } else {
    return 0;
  }
})
$('.plus').on('click', function(){
  var item = $(this);
  if(item.siblings('.input').val() < 3)
    item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
})
