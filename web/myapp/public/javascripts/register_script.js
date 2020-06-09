"use strict"

function sendPost(address, data) {
  let xhr = new XMLHttpRequest();
  xhr.open('POST', address, false);
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
  xhr.send(data);
  return xhr.responseText;
}

function check_pass(p1, p2)
{
  if (p1.value == p2.value && p1.value.length > 6) {
    //первичная проверка паролей
    return false;
  } else return true;
}

function getCheckedCheckBoxes() {
  var chb_1, chb_2;
  chb_1=document.getElementById('chb_1');
  chb_2=document.getElementById('chb_2');
  if (chb_1.checked) {
    return 'phys_type';
  } else {
    return 'ur_type';
  }
}

function form_check() {
    let first_pass = document.getElementById('first_pass');
    let sec_pass = document.getElementById('sec_pass');
    let username = document.getElementById('username');
    let email = document.getElementById('email');
    let phone_number = document.getElementById('phone_number');
    let chb = getCheckedCheckBoxes();
    let data = JSON.stringify({
      p1: first_pass.value,
      p2: sec_pass.value,
      u1: username.value,
      e1: email.value,
      c1: chb,
      n1: phone_number.value
    });

    switch (true) {
      case username.value.length > 14: alert('Имя слишком длинное'); break;
      case username.value.length < 3: alert('Имя слишком короткое'); break;
      case check_pass(first_pass, sec_pass): alert('Пароль слишком короткий или не совпадают'); break;
      default: {
        var res = sendPost("/register", data);
        alert(res);
      }
    }
  }
