  if(localStorage.getItem('cart')){
    var cart = 'hello';
    cart = JSON.parse(localStorage.getItem('cart'));
    $.post("/cart", cart).done(function(data){
      console.log(data.other,data.coffee,data.tea);
      var out = '';
          if(data.other)
            for(var i = 0; i<data.other.length; i++){
              var price = data.other[i].item_price;
              if (data.other[i].sale_price!=0) price = data.other[i].sale_price;
              out +=
                '<div type='+data.other[i].type+' class = "'+data.other[i].id+' good_cart">'
                  +'<img class="img_good_cart" src=/store_prods/'+data.other[i].type+'/'+data.other[i].sort+'/'+data.other[i].articul+'/'+'1.jpg>'
                  +'<a href="/shop/other?id='+data.other[i].id+'" class="item_name_cart">'+data.other[i].item_name+'</a>'
                  +'<div class="info_wrap">'
                    +'<p class="price"> Цена: '+Math.ceil((price*cart[data.other[i].type+data.other[i].id])*100)/100+' р.</p>'
                    +'<p class="item_count"> Кол-во: '+cart[data.other[i].type+data.other[i].id]+' шт.</p>'
                    +'<a class="change__amount_link" href="#range_other_'+data.other[i].id+'" data-toggle="collapse">Изменить</a>'
                    +'<div class="collapse change__amount_wrap" id="range_other_'+data.other[i].id+'">'
                      +'<div class="range_items">'
                        +'<button class="btn btn-secondary minus">'
                          +'<i class="fas fa-minus controls"></i>'
                        +'</button>'
                        +'<input type="text" value='+cart[data.other[i].type+data.other[i].id]+' class="input count_input_pack">'
                        +'<button class="btn btn-secondary plus">'
                          +'<i class="fas fa-plus controls"></i>'
                        +'</button>'
                      +'</div>'
                      +'<button class="btn btn-success change__amount_button_success">Подтвердить</button>'
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
              out +=
                '<div type='+data.tea[i].type+' class = "'+data.tea[i].id+' good_cart">'
                  +'<img class="img_good_cart" src=/store_prods/'+data.tea[i].type+'/'+data.tea[i].sort+'/'+data.tea[i].articul+'/'+'1.jpg>'
                  +'<a href="/shop/tea?id='+data.tea[i].id+'" class="item_name_cart">'+data.tea[i].item_name+'</a>'
                  +'<div class="info_wrap">'
                    +'<p class="price"> Цена: '+Math.ceil((price*cart[data.tea[i].type+data.tea[i].id])*100)/100+' р.</p>'
                    +'<p class="item_count"> Кол-во: '+cart[data.tea[i].type+data.tea[i].id]+' шт.</p>'
                    +'<a class="change__amount_link" href="#range_tea_'+data.tea[i].id+'" data-toggle="collapse">Изменить</a>'
                    +'<div class="collapse change__amount_wrap" id="range_tea_'+data.tea[i].id+'">'
                      +'<div class="range_items">'
                        +'<button class="btn btn-secondary minus">'
                          +'<i class="fas fa-minus controls"></i>'
                        +'</button>'
                        +'<input type="text" value='+cart[data.tea[i].type+data.tea[i].id]+' class="input count_input_pack">'
                        +'<button class="btn btn-secondary plus">'
                          +'<i class="fas fa-plus controls"></i>'
                        +'</button>'
                      +'</div>'
                      +'<button class="btn btn-success change__amount_button_success">Подтвердить</button>'
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
              out +=
                '<div type='+data.coffee[i].type+' class = "'+data.coffee[i].id+' good_cart">'
                  +'<img class="img_good_cart" src=/store_prods/'+data.coffee[i].type+'/'+data.coffee[i].sort+'/'+data.coffee[i].articul+'/'+'1.jpg>'
                  +'<a href="/shop/coffee?id='+data.coffee[i].id+'" class="item_name_cart"> '+data.coffee[i].item_name+'</a>'
                  +'<div class="info_wrap">'
                    +'<p class="price"> Цена: '+Math.ceil((price*cart[data.coffee[i].type+data.coffee[i].id])*100)/100+' р.</p>'
                    +'<p class="item_count"> Кол-во: '+cart[data.coffee[i].type+data.coffee[i].id]+' шт.</p>'
                    +'<a class="change__amount_link" href="#range_coffee_'+data.coffee[i].id+'" data-toggle="collapse">Изменить</a>'
                    +'<div class="collapse change__amount_wrap" id="range_coffee_'+data.coffee[i].id+'">'
                      +'<div class="range_items">'
                        +'<button class="btn btn-secondary minus">'
                          +'<i class="fas fa-minus controls"></i>'
                        +'</button>'
                        +'<input type="text" value='+cart[data.tea[i].type+data.coffee[i].id]+' class="input count_input_pack">'
                        +'<button class="btn btn-secondary plus">'
                          +'<i class="fas fa-plus controls"></i>'
                        +'</button>'
                      +'</div>'
                      +'<button class="btn btn-success change__amount_button_success">Подтвердить</button>'
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
              out +=
                '<div type='+data.horeca[i].type+' class = "'+data.horeca[i].id+' good_cart">'
                +'<img class="img_good_cart" src=/store_prods/horeca/'+data.horeca[i].sort+'/'+data.horeca[i].articul+'/'+'1.jpg>'
                +'<a href="/shop/horeca?id='+data.horeca[i].id+'" class="item_name_cart"> '+data.horeca[i].item_name+'</a>'
                +'<div class="info_wrap">'
                  +'<p class="price"> Цена: '+Math.ceil((price*cart[data.horeca[i].subtype+data.horeca[i].id])*100)/100+' р.</p>'
                  +'<p class="item_count"> Кол-во: '+cart[data.horeca[i].subtype+data.horeca[i].id]+' шт.</p>'
                  +'<a class="change__amount_link" href="#range_horeca_'+data.horeca[i].id+'" data-toggle="collapse">Изменить</a>'
                  +'<div class="collapse change__amount_wrap" id="range_horeca_'+data.horeca[i].id+'">'
                    +'<div class="range_items">'
                      +'<button class="btn btn-secondary minus">'
                        +'<i class="fas fa-minus controls"></i>'
                      +'</button>'
                      +'<input type="text" value='+cart[data.horeca[i].subtype+data.horeca[i].id]+' class="input count_input_pack">'
                      +'<button class="btn btn-secondary plus">'
                        +'<i class="fas fa-plus controls"></i>'
                      +'</button>'
                    +'</div>'
                    +'<button class="btn btn-success change__amount_button_success">Подтвердить</button>'
                  +'</div>'
                +'</div>'
                +'<button onclick=delfromcart("'+data.horeca[i].subtype+data.horeca[i].id+'") class="btn btn-danger del_btn">Удалить</button>'
                +'</div>'
              console.log(data.horeca);
            }
            out +=
              "<div class='final_price_wrap'>"
                +"<p class='delivery_text'> До бесплатной доставки осталось: "
                  +"<span class='delivery_price'>123</span>"
                  +" р."
                +"</p>"
                +"<p class='price_text'> Итоговая стоимость: "
                  +"<span class='final_price'>123</span>"
                  +" р."
                +"</p>"
              +"</div>";
            $('.all_li').html(out+"<button class='btn btn-success submit_cart'>Оформить заказ</button>");

            $('.submit_cart').on('click', function(){
              window.location.href = '/order';
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
              item.siblings('.input').val(parseInt(item.siblings('.input').val())+1);
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
