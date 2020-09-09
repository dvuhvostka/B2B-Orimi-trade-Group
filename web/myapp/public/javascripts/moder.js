$('.articul-find').on('click', ()=>{
  $.ajax({
    type:'POST',
    url:'/add',
    data:{
      post_type: 'getItem',
      articul:$('.articul').val()
    },
    success: (res) => {
      if(res.response.length){
        console.log(res.response[0]);
        var item = res.response[0];
        $('.found__item').removeClass('d-none');
        $('.found__item_none').addClass('d-none');

        $('.item__id span').html(item.id);
        $('.item__name').attr('value', item.item_name);
        $('.item__price').attr('value', item.item_price)
        $('.item__articul span').html(item.articul);
        $('.item__package').attr('value', item.packaging?item.packaging:'none');
        $('.item__box_count').attr('value', item.box_count);
        $('.item__weight').attr('value', item.weight?item.weight:'none');
        $('.item__type').attr('value', item.type);
        $('.item__sort').attr('value', item.sort);
        $('.item__price_sale').prop('checked', item.sale_price? true: false);
        $('.item__subtype').attr('value', item.subtype?item.subtype:'none');
      }
      else {
        $('.found__item_none').removeClass('d-none');
        $('.found__item').addClass('d-none');
      }
    }
  });
})

$('.btn__item_edit').on('click', ()=>{
  var inputs = $('.found__item input');
  var data = {};
  for(let each of inputs){
    var key = each.name;
    var value = each.value;
    if (key == 'sale'){
      if (each.checked){
      key = 'sale_price';
      value = true;
    } else {
      key = 'sale_price';
      value = false;
    }
  }
    if(value == 'none'){
      continue;
    }
    data[key] = value;
  }
  data['id'] = Number($('.item__id span').html());
  let json = JSON.stringify(data)
  $.ajax({
    type:"POST",
    url: '/add',
    data: {
      data: json,
      post_type: 'edit_product',
    },
    dataType: 'json',
    success: (res)=>{
      alert(res);
    }
  });
})

var select = document.querySelector('.main_select_type');

select.addEventListener('change',()=>{
  var selectedOption = select.options[select.selectedIndex].value;
  switch (selectedOption) {
    case 'tea':
        $('.product__type').addClass('d-none');
        $('.'+selectedOption+'_type').removeClass('d-none');
      break;
    case 'coffee':
        $('.product__type').addClass('d-none');
        $('.'+selectedOption+'_type').removeClass('d-none');
      break;
    case 'others':
        $('.product__type').addClass('d-none');
        $('.'+selectedOption+'_type').removeClass('d-none');
      break;
    case 'horeca':
        $('.product__type').addClass('d-none');
        $('.'+selectedOption+'_type').removeClass('d-none');
      break;
    case 'horeca2':
        $('.product__type').addClass('d-none');
        $('.'+selectedOption+'_type').removeClass('d-none');
    default:

  }
})
