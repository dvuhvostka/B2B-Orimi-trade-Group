console.log('connected');

function getOptimalSize(){
  var screen_width = {
    "320": 1,
    "375": 1,
    "425": 1,
    "768": 2,
    "1024": 2,
    "1440": 3,
    "2560": 4
  }
  var size = screen.width;
  for (let each of Object.keys(screen_width)){
  if (size <= each) {
    size = screen_width[each];
    break;
  }
}
  return size;
}

function setControls(left,right, margin){
    left.css({
      "margin-left": "-"+margin-20+"px"
    })
    right.css({
      "margin-right":"-"+(margin+20)+"px"
    })
}

function setOptimalWidth(size, content_width, elem){
  var margin = size*content_width/2-10;
  console.log(margin);
    elem.css({
      "width": size*content_width,
    })
    elem.css({
      "margin-left": "-"+margin+'px',
    })
    console.log(elem.css('margin-left'));
    return margin;
}

function slider(l){
  var left = $('.control-left');
  var right = $('.control-right');
  var wrap = $('.carousel-wrap');
  var inner = $('.carousel-inner')
  var optimal_size = getOptimalSize();
  var length = l;
  if (optimal_size > length){
    optimal_size = length;
  }
  const content_width = 300;
  var margin = setOptimalWidth(optimal_size,content_width,inner);
  setControls(left,right,margin);
  var busy;
  var wrap = $('.carousel-wrap');
  wrap.css({
    'width': content_width*l+"px"
  })
  left.on('click', function(){
    if(busy)
      return;
    busy = true;
    console.log(parseInt(wrap.css('left')));
      if(parseInt(wrap.css('left')) <= -content_width)
      wrap.css({
        "left":  "+=300px"
      });
      setTimeout(function(){
        busy = false;
      },500);
  });

  right.on('click', function(){
    if(busy)
      return;
    busy = true;
    console.log(parseInt(wrap.css('left')));
    if(parseInt(wrap.css('left')) > -(content_width*length-optimal_size*content_width))
    wrap.css({
      "left": "-=300px"
    });
    setTimeout(function(){
      busy = false;
    },500)
  });
}
