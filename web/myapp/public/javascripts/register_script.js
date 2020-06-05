"use strict"

function sendPost(address, data) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', address, false);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.send(data);
  alert(xhr.responseText);
}

function check_pass(p1, p2)
{
  if (p1.value == p2.value && p1.value.length > 6) {
    //первичная проверка паролей
    return true;
  } else return false;
}

function form_check() {
    let first_pass = document.getElementById('first_pass');
    let sec_pass = document.getElementById('sec_pass');
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let data = JSON.stringify({
      p1: first_pass.value,
      p2: sec_pass.value,
      u1: username.value,
      e1: email.value
    });
    if (username.value.length < 3 || username.value.length > 11){
      if(check_pass(first_pass, sec_pass)){
        alert("Измените имя")
      } else {
        alert("Имя и пароль введены не верно")
      }
    } else {
      if(check_pass(first_pass, sec_pass)){
        sendPost("/register", data)
      }
      else {
        alert("Слишком короткий пароль или пароли не совпадают")
      }
    }
  }
