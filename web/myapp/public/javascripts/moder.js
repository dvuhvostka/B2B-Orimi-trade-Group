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
        $('.item__shtrixkod').attr('value', item.barcode);
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
        showModal('Товар успешно удален \n'+name,'Успешно');
      }else{
        showModal('Такого товара нет',"Ошибка");
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
      if (res.ok){
        showModal(res.msg, 'Успешно', true)
      } else {
        showModal(res.msg, 'Ошибка', false)
      }
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
        // var result = 'Имя организации: '+res.data.org_name+'\nИмя владельца: '
        // +res.data.owner_name+'\nФамилия владельца: '+res.data.owner_sname+
        // '\nОтчество владельца: '+res.data.owner_tname+'\nЭлектронная почта: '
        // +res.user_info.email+'\nТелефон: '+res.user_info.number;
        var result = `
        Название&nbsp;организации:&nbsp;`+res.data.org_name+`<br />
        Фамилия&nbsp;владельца:&nbsp;`+res.data.owner_sname+`<br />
        Имя&nbsp;владельца:&nbsp;`+res.data.owner_name+`<br />
        Отчество&nbsp;владельца:&nbsp;`+res.data.owner_tname+`<br />
        Электронная&nbsp;почта:&nbsp;`+res.user_info.email+`<br />
        ИНН&nbsp;`+res.data.owner_inn+`<br />
        Телефон:&nbsp;`+res.user_info.number+`
        `;
        showModal(result, 'Успешно');
      }else {
        showModal('Внутренняя ошибка','Ошибка');
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
        showModal("Обращение удалено!",'Успешно',true);
      } else {
        showModal("Внутренняя ошибка, повторите позже"+res.error,"Ошибка");
      }
    }
  });
})

$('.search_btn').on('click', (e)=>{
  var input_val = e.currentTarget.previousSibling.value;
  var placement = document.querySelector('.results_wrap');
  placement.innerHTML = '';
  $.ajax({
    type: "POST",
    url: "/add",
    data: {
      post_type: 'search_firm',
      value: input_val,
    },
    success: (res) => {
      if(res.ok){
        if(res.data){
          var data = res.data;
          data.forEach((elem) => {
            var div = document.createElement('div');
            var addres_div =``;
            for(var i = 0; i < elem.org_address_fact.length;i++){
              addres_div += `
              <div class='in b'>
              <p class='address'>Фактический адрес №`+(i+1)+`</p>
              <p>`+elem.org_address_fact[i]+`</p>
              </div>
              `;
            }
            div.innerHTML += `</div>`;
            div.classList.add('result');
            div.innerHTML = `
            <div class='in b'>
            <p>Название организации</p>
            <p>`+elem.org_name+`</p>
            </div>
            <div class='in b'>
            <p>Юридический адрес</p>
            <p>`+elem.org_address_ur+`</p>
            </div>
            <div class='in b'>
            <p>ИНН</p>
            <p>`+elem.owner_inn+`</p>
            </div>
            <div class='in b'>
            <p>ФИО</p>
            <p>`+elem.owner_sname+` `+elem.owner_name+` `+elem.owner_tname+`</p>
            </div>
            <div class='in b'>
            <p>Тип организации</p>
            <p>`+elem.type+`</p>
            </div>
            <div class='in b'>
            <p>Доступ к акции "Продержи-получи"</p>
            <p>`+(elem.stock_access?'Да':'Нет')+`</p>
            </div>
            `+addres_div+`
            <div class='editing_btns'>
            <button class='btn btn-primary print_btn' data-id='`+elem.owner_id+`'>Распечатать док-ты</button>
            <button class='btn btn-primary sale_btn' data-id='`+elem.id+`' data-status='`+elem.stock_access+`'>Изменить доступ к акции</button>
            <button class='btn btn-danger del_btn' data-id='`+elem.owner_id+`'>Удалить организацию</button>
            </div>
            `;

            placement.append(div);
          });
      } else {
        showModal('Фирма не найдена', "Ошибка")
      }
    } else {
      showModal(res.err, 'Ошибка');
    }
      $('.print_btn').on('click', (e)=>{
        var item = e.currentTarget;
        var id = item.getAttribute('data-id');
        $.ajax({
          type:'POST',
          url:'/add',
          data:{
            post_type: 'get_images',
            id: id
          },
          success: (res)=>{
            if (res.ok){
              var print = document.querySelector('#print');
              var html = ``;
              res.files.forEach((elem)=>{
                html += `<img class='docs' src='confirmed_uploads/`+id+`/`+elem+`'>`;
              })
              // console.log(html);
              print.innerHTML = html;
              setTimeout(()=>{
                window.print();
                print.innerHTML = "";
              },1500);
            }
          }
        });
      });
      $('.sale_btn').on('click', (e)=>{
        var item = e.currentTarget;
        var id = item.getAttribute('data-id');
        var status = item.getAttribute('data-status');
        $.ajax({
          type:'POST',
          url:'/add',
          data:{
            post_type: 'toggle_sale',
            id: id,
            status: status,
          },
          success: (res)=>{
            if (res.ok){
              showModal('Доступ к акции изменен','Успешно',true);
            } else {
              showModal('Ошибка! Невозможно изменить доступ\n'+res.err,'Ошибка');
            }
          }
        });
      });
      $('.del_btn').on('click', (e)=>{
        var item = e.currentTarget;
        var id = item.getAttribute('data-id');
        $.ajax({
          type:'POST',
          url:'/user',
          data:{
            post_type: 'delete_org_skdjfgh213asRQadSKSFD3123244',
            confirmed: true,
            org_owner_id: id
          },
          success: (res)=>{
            if (res.ok){
              showModal('Организация удалена.','Успешно');
            } else {
              showModal('Ошибка! Невозможно удалить организацию\n'+res.err,"Ошибка");
            }
          }
        });
      });
    }
  });
});
