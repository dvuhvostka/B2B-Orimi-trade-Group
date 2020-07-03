"use strict"

function addNews() {
  var newsTitle = document.getElementById("newsTitle");
  var newsDescription = document.getElementById("newsDescription");
  var newsBody = document.getElementById("newsBody");
  var newsImg = document.getElementById("newsImg");

  var data = JSON.stringify({
    title: newsTitle.value,
    desc: newsDescription.value,
    body: newsBody.value,
    img: newsImg.value
  })
  console.log(newsTitle.value);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', "/add", false);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.send(data);
  return xhr.responseText;
}
