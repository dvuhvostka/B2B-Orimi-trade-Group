  if(localStorage.getItem('cart')){
    var cart = 'hello';
    cart = JSON.parse(localStorage.getItem('cart'));
    $.post("/cart", cart).done(function(data){
      $.ajax({
        type: 'POST',
        url: '/order',
        data: {post_type: "getcartcost", cart: localStorage.getItem('cart')},
        success: function(r){
          if(!r.ok){
            $('.submit_cart').prop("disabled", "true");
          }
        }
      });
      var final_price_result = 0;
      var out = '';
          if(data.other)
            for(var i = 0; i<data.other.length; i++){
              var price = data.other[i].item_price;
              if (data.other[i].sale_price!=0) price = data.other[i].sale_price;
              final_price_result+= Math.round((price*cart[data.other[i].type+data.other[i].id])*100)/100;
              out +=
                '<div type='+data.other[i].type+' class = "'+data.other[i].id+' good_cart">'
                  +'<img class="img_good_cart" src=/store_prods/'+data.other[i].type+'/'+data.other[i].sort+'/'+data.other[i].articul+'/'+'1.jpg>'
                  +'<a href="/shop/other?id='+data.other[i].id+'" class="item_name_cart">'+data.other[i].item_name+'</a>'
                  +'<div class="info_wrap">'
                    +'<p class="price" price="'+price+'"> Цена: '+Math.ceil((price*cart[data.other[i].type+data.other[i].id])*100)/100+' р.</p>'
                    +'<p class="item_count"> Кол-во: '+cart[data.other[i].type+data.other[i].id]+' шт.</p>'
                    +'<a class="change__amount_link" href="#range_other_'+data.other[i].id+'" data-toggle="collapse">Изменить</a>'
                    +'<div class="collapse change__amount_wrap" id="range_other_'+data.other[i].id+'">'
                      +'<div class="range_items">'
                        +'<button class="btn btn-secondary minus">'
                          +'<i class="fas fa-minus controls"></i>'
                        +'</button>'
                        +'<input type="text" value='+cart[data.other[i].type+data.other[i].id]+' class="input count_input_pack sym_none">'
                        +'<button class="btn btn-secondary plus">'
                          +'<i class="fas fa-plus controls"></i>'
                        +'</button>'
                      +'</div>'
                      +'<button type="'+data.other[i].type+'" data-id="'+data.other[i].id+'" class="addtocart btn btn-success change__amount_button_success">Подтвердить</button>'
                    +'</div>'
                  +'</div>'
                  +'<button onclick=delfromcart("'+data.other[i].type+data.other[i].id+'") class="btn btn-danger del_btn">Удалить</button>'
                +'</div>'
              console.log(data.other[i]);
            }
          if(data.tea)
            for(var i = 0; i<data.tea.length; i++){
              var price = data.tea[i].item_price;
              if (data.tea[i].sale_price!=0) price = data.tea[i].sale_price;
              final_price_result+= Math.round((price*cart[data.tea[i].type+data.tea[i].id])*100)/100;
              out +=
                '<div type='+data.tea[i].type+' class = "'+data.tea[i].id+' good_cart">'
                  +'<img class="img_good_cart" src=/store_prods/'+data.tea[i].type+'/'+data.tea[i].sort+'/'+data.tea[i].articul+'/'+'1.jpg>'
                  +'<a href="/shop/tea?id='+data.tea[i].id+'" class="item_name_cart">'+data.tea[i].item_name+'</a>'
                  +'<div class="info_wrap">'
                    +'<p class="price" price="'+price+'"> Цена: '+Math.ceil((price*cart[data.tea[i].type+data.tea[i].id])*100)/100+' р.</p>'
                    +'<p class="item_count"> Кол-во: '+cart[data.tea[i].type+data.tea[i].id]+' шт.</p>'
                    +'<a class="change__amount_link" href="#range_tea_'+data.tea[i].id+'" data-toggle="collapse">Изменить</a>'
                    +'<div class="collapse change__amount_wrap" id="range_tea_'+data.tea[i].id+'">'
                      +'<div class="range_items">'
                        +'<button class="btn btn-secondary minus">'
                          +'<i class="fas fa-minus controls"></i>'
                        +'</button>'
                        +'<input type="text" value='+cart[data.tea[i].type+data.tea[i].id]+' class="input count_input_pack sym_none">'
                        +'<button class="btn btn-secondary plus">'
                          +'<i class="fas fa-plus controls"></i>'
                        +'</button>'
                      +'</div>'
                      +'<button type="'+data.tea[i].type+'" data-id="'+data.tea[i].id+'" class="addtocart btn btn-success change__amount_button_success">Подтвердить</button>'
                    +'</div>'
                  +'</div>'
                +'<button onclick=delfromcart("'+data.tea[i].type+data.tea[i].id+'") class="btn btn-danger del_btn">Удалить</button>'
                +'</div>'
              console.log(data.tea[i]);
            }
          if(data.coffee)
            for(var i = 0; i<data.coffee.length; i++){
              var price = data.coffee[i].item_price;
              if (data.coffee[i].sale_price!=0) price = data.coffee[i].sale_price;
              final_price_result+= Math.round((price*cart[data.coffee[i].type+data.coffee[i].id])*100)/100;
              out +=
                '<div type='+data.coffee[i].type+' class = "'+data.coffee[i].id+' good_cart">'
                  +'<img class="img_good_cart" src=/store_prods/'+data.coffee[i].type+'/'+data.coffee[i].sort+'/'+data.coffee[i].articul+'/'+'1.jpg>'
                  +'<a href="/shop/coffee?id='+data.coffee[i].id+'" class="item_name_cart"> '+data.coffee[i].item_name+'</a>'
                  +'<div class="info_wrap">'
                    +'<p class="price" price="'+price+'"> Цена: '+Math.ceil((price*cart[data.coffee[i].type+data.coffee[i].id])*100)/100+' р.</p>'
                    +'<p class="item_count"> Кол-во: '+cart[data.coffee[i].type+data.coffee[i].id]+' шт.</p>'
                    +'<a class="change__amount_link" href="#range_coffee_'+data.coffee[i].id+'" data-toggle="collapse">Изменить</a>'
                    +'<div class="collapse change__amount_wrap" id="range_coffee_'+data.coffee[i].id+'">'
                      +'<div class="range_items">'
                        +'<button class="btn btn-secondary minus">'
                          +'<i class="fas fa-minus controls"></i>'
                        +'</button>'
                        +'<input type="text" value='+cart[data.coffee[i].type+data.coffee[i].id]+' class="input count_input_pack sym_none">'
                        +'<button class="btn btn-secondary plus">'
                          +'<i class="fas fa-plus controls"></i>'
                        +'</button>'
                      +'</div>'
                      +'<button type="'+data.coffee[i].type+'" data-id="'+data.coffee[i].id+'" class="addtocart btn btn-success change__amount_button_success">Подтвердить</button>'
                    +'</div>'
                  +'</div>'
                  +'<button onclick=delfromcart("'+data.coffee[i].type+data.coffee[i].id+'") class="btn btn-danger del_btn">Удалить</button>'
                +'</div>'
              console.log(data.coffee[i]);
            }
          if(data.horeca)
            for(var i = 0; i<data.horeca.length; i++){
              var price = data.horeca[i].item_price;
              if (data.horeca[i].sale_price!=0) price = data.horeca[i].sale_price;
              final_price_result+= Math.round((price*cart[data.horeca[i].subtype+data.horeca[i].id])*100)/100;
              out +=
                '<div type='+data.horeca[i].type+' class = "'+data.horeca[i].id+' good_cart">'
                +'<img class="img_good_cart" src=/store_prods/horeca/'+data.horeca[i].sort+'/'+data.horeca[i].articul+'/'+'1.jpg>'
                +'<a href="/shop/horeca?id='+data.horeca[i].id+'" class="item_name_cart"> '+data.horeca[i].item_name+'</a>'
                +'<div class="info_wrap">'
                  +'<p class="price" price="'+price+'"> Цена: '+Math.ceil((price*cart[data.horeca[i].subtype+data.horeca[i].id])*100)/100+' р.</p>'
                  +'<p class="item_count"> Кол-во: '+cart[data.horeca[i].subtype+data.horeca[i].id]+' шт.</p>'
                  +'<a class="change__amount_link" href="#range_horeca_'+data.horeca[i].id+'" data-toggle="collapse">Изменить</a>'
                  +'<div class="collapse change__amount_wrap" id="range_horeca_'+data.horeca[i].id+'">'
                    +'<div class="range_items">'
                      +'<button class="btn btn-secondary minus">'
                        +'<i class="fas fa-minus controls"></i>'
                      +'</button>'
                      +'<input type="text" value='+cart[data.horeca[i].subtype+data.horeca[i].id]+' class="input count_input_pack sym_none">'
                      +'<button class="btn btn-secondary plus">'
                        +'<i class="fas fa-plus controls"></i>'
                      +'</button>'
                    +'</div>'
                    +'<button type="'+data.horeca[i].subtype+'" data-id="'+data.horeca[i].id+'" class="addtocart btn btn-success change__amount_button_success">Подтвердить</button>'
                  +'</div>'
                +'</div>'
                +'<button onclick=delfromcart("'+data.horeca[i].subtype+data.horeca[i].id+'") class="btn btn-danger del_btn">Удалить</button>'
                +'</div>'
              console.log(data.horeca);
            }
          if(data.sets)
            for(var i = 0; i<data.sets.length; i++){
              var price = data.sets[i].set_price;
              final_price_result+= Math.round((price*cart['sets'+data.sets[i].set_id])*100)/100;
              out +=
                '<div type=sets class = "'+data.sets[i].sets_id+' good_cart">'
                +'<img class="img_good_cart" src=/sales/sets/'+data.sets[i].set_id+'logo.png>'
                +'<a href="/sales/set?id='+data.sets[i].set_id+'" class="item_name_cart"> '+data.sets[i].item_name+'</a>'
                +'<div class="info_wrap">'
                  +'<p class="price" price="'+price+'"> Цена: '+Math.ceil((price*cart['sets'+data.sets[i].set_id])*100)/100+' р.</p>'
                  +'<p class="item_count"> Кол-во: '+cart['sets'+data.sets[i].set_id]+' шт.</p>'
                  +'<a class="change__amount_link" href="#range_horeca_'+data.sets[i].set_id+'" data-toggle="collapse">Изменить</a>'
                  +'<div class="collapse change__amount_wrap" id="range_horeca_'+data.sets[i].set_id+'">'
                    +'<div class="range_items">'
                      +'<button class="btn btn-secondary minus">'
                        +'<i class="fas fa-minus controls"></i>'
                      +'</button>'
                      +'<input type="text" value='+cart['sets'+data.sets[i].set_id]+' class="input count_input_pack sym_none">'
                      +'<button class="btn btn-secondary plus" type="sets">'
                        +'<i class="fas fa-plus controls"></i>'
                      +'</button>'
                    +'</div>'
                    +'<button type="sets" data-id="'+data.sets[i].set_id+'" class="addtocart btn btn-success change__amount_button_success">Подтвердить</button>'
                  +'</div>'
                +'</div>'
                +'<button onclick=delfromcart("sets'+data.sets[i].set_id+'") class="btn btn-danger del_btn">Удалить</button>'
                +'</div>'
            }
            var rc = Math.round((final_price_result)*100)/100;
            var rc2 = 4000-rc;
            out +=
              "<div class='final_price_wrap'>"
                +"<p class='delivery_text'> До бесплатной доставки осталось: "
                  +"<span class='delivery_price'>"+Math.round((rc2)*100)/100+"</span>"
                  +" р."
                +"</p>"
                +"<p class='rest'></p>"
                +"<p class='price_text'> Итоговая стоимость: "
                  +"<span class='final_price'>"+Math.round((final_price_result)*100)/100+"</span>"
                  +" р."
                +"</p>"
              +"</div>";
            $('.all_li').html(out
              +"<button class='btn btn-success submit_cart'>Оформить заказ</button>");

            if(rc>4000){
              $('.delivery_text').html('Ваш заказ будет доставлен бесплатно!');
            }

            $('.submit_cart').on('click', function(){
              window.location.href = '/order';
            });

            if(Math.round((final_price_result)*100)/100<2000){
              var rest = 2000-Math.round((final_price_result)*100)/100;
              $('.submit_cart').prop("disabled", true);
              $('.rest').html("До минимальной суммы заказа осталось: "+rest+" руб.")
            }

            var input_check = $('.sym_none');
              for(let each of input_check){
                each.onkeypress=function(e){
                  e = e || event;
                  if (e.ctrlKey || e.altKey || e.metaKey) return;
                  var chr = String.fromCharCode(e.which);
                  if (chr == null) return;
                  if (chr < '0' || chr > '9') {
                    return false;
                  }
                }
              }

              $('.count_input_pack').on('keyup', function(){
                var item = $(this);
                if(item.val()>1000){
                  item.val(1000);
                }
              });

              $('.addtocart').on('click', function(){
                var item = $(this);
                var data_id = item.attr('data-id');
                var data_type = item.attr('type');
                var input =  item.siblings('.range_items').children('.input');
                var wrap = item.closest('.info_wrap');
                var articul = data_type+data_id;
                if(input.val()*1>0){
                  cart[articul] = input.val();
                  var price = Math.round((wrap.children('.price').attr('price')*input.val())*100)/100;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                  $.ajax({
                    type: 'POST',
                    url: '/order',
                    data: {post_type: "getcartcost", cart: localStorage.getItem('cart')},
                    success: function(r){
                        if(r.ok){
                            localStorage.setItem('cart', JSON.stringify(cart));
                            $('.submit_cart').prop("disabled", false);
                            wrap.children('.item_count').html('Кол-во: '+input.val()+' шт.');
                            wrap.children('.price').html('Цена: '+price+' р.');
                          var rounded_cost = Math.round((r.fullcost)*100)/100;
                          $('.final_price').html(rounded_cost+' ');
                          if(rounded_cost<4000){
                            if(rounded_cost<2000){
                              var rest = 2000-rounded_cost;
                              $('.submit_cart').prop("disabled", true);
                              $('.rest').html("До минимальной суммы заказа осталось: "+rest+" руб.")
                            }else{
                              $('.submit_cart').prop("disabled", false);
                              $('.rest').html("");
                            }
                            var rc3 = Math.round((4000-rounded_cost)*100)/100;
                            $('.delivery_text').html('До бесплатной доставки осталось: <span class="delivery_price">'+rc3+'</span> р.');
                          }else {
                            $('.delivery_text').html('Ваш заказ будет доставлен бесплатно!');
                          }
                        }else{
                          if(r.rest!=0){
                            cart[articul] = r.rest;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            input.val(r.rest);
                            showModal(r.error, 'Ошибка');
                          }else{
                            delete cart[articul];
                            showModal(r.error, 'Ошибка');
                            location.reload();
                          }
                        }
                    }
                  });
              });

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
              if(item.attr('type')=='sets'){
                if (item.siblings('.input').val() < 3){
                  item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
                } else {
                  return 0;
                }
              }else if((item.siblings('.input').val() > 1)&&(item.siblings('.input').val() < 1000)){
                item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
              }
            })

    });
    function delfromcart(articul){
      delete cart[articul];
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log(Object.keys(cart).length);
      if(Object.keys(cart).length==0){
        localStorage.removeItem('cart');
      }
      document.location.reload(true);
    }

  }else {$('.all_li').html("<p class='null_cart'>Товаров в корзине нет!</p>");}
