function infscroll (data) {

  function showmore(items,size,data_size,current_size){
    var parent = document.querySelector('.item_list');
    var page_size = size;
    if (data_size - current_size < size){
      page_size = data_size - current_size;
    }
    console.log(items[current_size].id);

    for ( var i = 0; i < page_size; i++ )
    {
        var item = document.createElement('div');
        item.classList.add('shop_item');
        item.setAttribute("id", items[current_size+i].id);
        item.setAttribute("sort", items[current_size+i].sort);
        item.setAttribute("about", items[current_size+i].about);
        item.setAttribute("weight", items[current_size+i].weight);
        item.setAttribute("packaging", items[current_size+i].packaging);
        item.setAttribute("bags", items[current_size+i].bags);

        if ( items[current_size+i].bestseller )
        {
          item.innerHTML += `<div class='bestseller'><span>Бестселлер</span></div>`;
        }
        if ( items[current_size+i].subtype )
        {
          item.innerHTML += `<div class='carousel_img'>
                             <img src="../store_prods/horeca/`+items[current_size+i].sort+`/`+items[current_size+i].articul+`/1.jpg">
                             </div>
                             <a href="/shop/`+items[current_size+i].subtype+`?id=`+items[current_size+i].id+`" class='item_name'>`+items[current_size+i].item_name+`</a>`;
        }
        else
        {
          item.innerHTML += `<div class='carousel_img'>
                             <img src="../store_prods/`+items[current_size+i].type+`/`+items[current_size+i].sort+`/`+items[current_size+i].articul+`/1.jpg">
                             </div>
                             <a href="/shop/`+items[current_size+i].type+`?id=`+items[current_size+i].id+`" class='item_name'>`+items[current_size+i].item_name+`</a>`;
        }
        item.innerHTML += items[current_size + i].sale_price ? `<p class='item_price sale_price'>`+items[current_size + i].sale_price+`
                                                                  <i class='fas fa-ruble-sign rs'></i>
                                                                  <sup class='sale_price_old'>`+items[current_size + i].item_price+`
                                                                  <i class='fas fa-ruble-sign rs sale_sign'></i>
                                                                  </sup>
                                                                  </p>` : `<p class='item_price'>`+items[current_size + i].item_price+`
                                                                              <i class='fas fa-ruble-sign rs'></i>
                                                                          </p>`;
        item.innerHTML += `<div class="footer_item">
                           <button class="b addtocart btn btn-primary" type="`+(items[current_size+i].subtype ? items[current_size+i].subtype : items[current_size+i].type)+`" data-id="`+items[current_size+i].id+`">
                           Купить
                           </button>
                           <div class="sht">Кол-во в шт
                            <div class="range_items">
                              <button class="btn btn-secondary minus"><i class="fas fa-minus controls"></i></button>
                              <input class="input count_input_pack" type="text" value="1" data-id="`+items[current_size + i].id+`"/>
                              <button class="btn btn-secondary plus"><i class="fas fa-plus controls"></i></button>
                            </div>
                          </div>
                          <div class="kor">Кол-во в коробках
                           <div class="range_items">
                             <button class="btn btn-secondary box_count_minus" box_count="`+items[current_size + i].box_count+`"><i class="fas fa-minus controls"></i></button>
                             <input class="input count_input_box" type="text" value="0" id-data="`+items[current_size + i].id+`" box_count="`+items[current_size + i].box_count+`"/>
                             <button class="btn btn-secondary box_count_plus" box_count="`+items[current_size + i].box_count+`"><i class="fas fa-plus controls"></i></button>
                           </div>
                         </div>
                          </div>`;

                          item.querySelector('.minus').addEventListener('click', function(e){
                            var it = e.currentTarget;
                            var input = it.parentNode.querySelector('.input');
                            var other = input.classList.contains('count_others')
                            if (input.value > 1 && !other){
                              input.value = parseInt(input.value -= 1);
                              var input_kor = it.parentNode.parentNode.parentNode.querySelector('.kor').querySelector('.input');
                              var get_box_count = input_kor.getAttribute('box_count');
                              input_kor.value = (Math.round((input.value/get_box_count)*10)/10);
                            } else if (other){
                                var get_box_count = parseInt(input.getAttribute('box_count'));

                                if(input.value >= get_box_count ){

                                  input.value = parseInt(input.value)-get_box_count;

                                }

                            } else {
                              return 0;
                            }
                          })

                          item.querySelector('.plus').addEventListener('click', function(e){
                            var it = e.currentTarget;
                            var input = it.parentNode.querySelector('.input');
                            var other = input.classList.contains('count_others')
                            if(input.value < 1000 && !other){
                              input.value = parseInt(input.value) + 1;
                              var input_kor = it.parentNode.parentNode.parentNode.querySelector('.kor').querySelector('.input');
                              var get_box_count = input_kor.getAttribute('box_count');
                              input_kor.value = Math.round((input.value / get_box_count)*10)/10;
                            } else if (other){

                                var get_box_count = parseInt(input.getAttribute('box_count'));
                                if(input.value <= get_box_count*1000){

                                  input.value = parseInt(input.value) + get_box_count;

                                }
                            }
                          })

                          item.querySelector('.kor .range_items .input').addEventListener('change',function(e){
                            var it = e.currentTarget;
                            var input_sht = it.parentNode.parentNode.parentNode.querySelector('.sht').querySelector('.input');
                            input_sht.value = it.getAttribute('box_count')*item.value;
                          })

                          if(!localStorage.getItem('cart')){
                            var cart = {};
                          } else cart = JSON.parse(localStorage.getItem('cart'));


                          item.querySelector('.box_count_plus').addEventListener('click', function(e){
                            var it = e.currentTarget;
                            var input = it.parentNode.querySelector('.input');
                            if(input.value < 100){
                              input.value = parseInt(input.value) + 1;
                              var input_sht = it.parentNode.parentNode.parentNode.querySelector('.sht').querySelector('.input');
                              input_sht.value = it.getAttribute('box_count')*input.value;
                            }
                          });

                          item.querySelector('.box_count_minus').addEventListener('click', function(e){
                            var it = e.currentTarget;
                            var input = it.parentNode.querySelector('.input');
                            if (input.value >= 1){
                              input.value = parseInt(input.value)-1;
                              var input_sht = it.parentNode.parentNode.parentNode.querySelector('.sht').querySelector('.input');
                              input_sht.value = it.getAttribute('box_count')*input.value;
                            } else {
                              return 0;
                            }
                          });

                          item.querySelector('.count_input_pack').addEventListener('change paste',function(e){
                            var item = e.currentTarget;
                            var input_kor = it.parentNode.parentNode.parentNode.querySelector('.kor').querySelector('.input');
                            var get_box_count = input_kor.getAttribute('box_count');
                            input_kor.value = Math.round((item.value / get_box_count)*10)/10;
                          });

                          item.querySelector('.count_input_pack').addEventListener('keyup', function(e){
                            var it = e.currentTarget;
                            var other = it.classList.contains('count_others');
                            var get_box_count = parseInt(it.getAttribute('box_count'));
                            if(item.value > 1000 && !other){
                              item.value = 1000;
                            } else if (other && item.value % get_box_count != 0 && item.value <= get_box_count*1000) {
                              var amount = Math.round(item.value / get_box_count)+1;
                              it.value = amount*get_box_count;
                            } else if (item.value > get_box_count*1000){
                              it.value = 1000*get_box_count;
                            } else if (item.value == 0){
                              item.value = get_box_count;
                            }
                          });

                          var input_check = document.querySelectorAll('.input');
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

                          item.querySelector('.addtocart').addEventListener('click', function(e){
                            var it = e.currentTarget;
                            var data_id = it.getAttribute('data-id');
                            var data_type = it.getAttribute('type');
                            var input =  it.parentNode.querySelector('.sht').querySelector('.input');
                            var articul = data_type + data_id;
                              cart[articul] = input.value;
                              localStorage.setItem('cart', JSON.stringify(cart));
                              $('.toast').toast('show');
                              console.log(cart);
                          })
        parent.append(item);
    }
    return current_size += page_size;
  }

  console.log(data);
  var item_list = document.querySelector('.item_list');
  const size = 16;
  var data_size = data.length;
  var current_size = size;
  window.addEventListener('scroll',()=>{
    var contentHeight = item_list.offsetHeight;
    var yOffset       = window.pageYOffset;      // 2) текущее положение скролбара
    var window_height = window.innerHeight;      // 3) высота внутренней области окна документа
    var y             = yOffset + window_height;

    if(y >= contentHeight){
      current_size = showmore(data, size, data_size, current_size);
    }
  });
}
