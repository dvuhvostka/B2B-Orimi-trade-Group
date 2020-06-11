"use strict"

function sendPost(address, data) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', address, false);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.send(data);
  return xhr.responseText;
}

function login() {
  let email = document.getElementById('email_addr');
  let password = document.getElementById('password');
  let data = JSON.stringify({
    email: email.value,
    password: password.value
  });
  var res = sendPost("/login", data);
  alert(res);
}
