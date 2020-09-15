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
        $('.item__articul').attr('value', item.articul);
        $('.item__shtrixkod').attr('shtrixkod', item.shtrihkod);
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

$('.articul-delete').on('click', ()=>{
  $.ajax({
    type:'POST',
    url:'/add',
    data:{
      post_type: 'deleteItem',
      articul:$('.articul-del').val()
    },
    success: (res) => {
      if(res.response.length){
        var name = res.response[0].item_name;
        alert('Товар успешно удален \n'+name);
      }else{
        alert('Такого товара нет');
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

$('.btn__request_info').on('click', function(){
  var org_id = $(this).parent().siblings('.request__org_id_wrap').children('.request__org_id').html()
  console.log(org_id);
  $.ajax({
    type: 'POST',
    url: '/add',
    data: {
      post_type: 'get_org_info',
      id: org_id,
    },
    success: (res) => {
      if (res.ok){
        var result = 'Имя организации: '+res.data.org_name+'\nИмя владельца: '
        +res.data.owner_name+'\nФамилия владельца: '+res.data.owner_sname+
        '\nОтчество владельца: '+res.data.owner_tname+'\nЭлектронная почта: '
        +res.user_info.email+'\nТелефон: '+res.user_info.number;
        alert(result);
      }else {
        alert('Внутренняя ошибка');
      }
    }
  });
});

$('.btn__request_delete').on('click', function(){
  var org1_id = $(this).parent().siblings('.request__org_id_wrap').children('.request__org_id').html();
  var request_id = $(this).parent().siblings('.request__headder').children('.request__id').html();
  $.ajax({
    type: 'POST',
    url: '/add',
    data: {
      post_type: 'delete_org',
      org_id: org1_id,
      req_id: request_id,
    },
    success: (res) => {
      if (res.ok){
        alert("Обращение удалено!");
        document.location.reload();
      } else {
        alert("Внутренняя ошибка, повторите позже"+res.error);
      }
    }
  });
})
