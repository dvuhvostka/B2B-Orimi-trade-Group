var express = require('express');
var user = express.Router();
var path = require('path');
var app = require('../app');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('../config');
var {Pool, Client} = require('pg');
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://"+config.DB_USER+":"+config.DB_PASSWORD+"@"+config.DB_HOST+":5432/"+config.DB_NAME);

const {
  SESS_LIFETIME = config.SESS_TIME,
  ENVIRONMENT = config.ENVIRONMENT,
  SESS_NAME = config.SESS_NAME,
  SESS_SECRET = config.SESS_SECRET,
  USER = config.DB_USER,
  PASSWORD = config.DB_PASSWORD,
  HOST = config.DB_HOST,
  DBNAME = config.DB_NAME
} = process.env

var pgPool = new Pool({
  host: HOST,
  user: "z0rax",
  password: "12345",
  database: DBNAME
});

const redirectLogin = function(req,res,next){
  if(!req.session.userId){
    res.redirect('/login')
  }else {
    next()
  }
}

user.route('/user')
.get(redirectLogin, function(req, res, next) {
  var getUserData = `SELECT * FROM users WHERE id='`+req.session.userId+`'`;
  var getUserDeals = `SELECT * FROM deals WHERE deal_owner='`+req.session.userId+`'`;
  pgPool.query(getUserData,[], function(err, response){
    if((response.rows[0].name==null)&&(response.rows[0].second_name==null)){
      res.render('user',{
        isRegistred: req.session.userId,
        user_name: 0,
        user_second_name: 0,
        number: response.rows[0].number,
        balance:response.rows[0].balance,
        title: 'Профиль'
      })
    }else if(response.rows[0]){
      var get_org = `SELECT * FROM organizations WHERE owner_id='`+req.session.userId+`'`;
      var org_info = 0;
      var status;
      pgPool.query(get_org,[], function(err, resp){
        if(resp.rows[0]){
          if(resp.rows[0].org_confirmed == 0){org_info=1; var status = 'Организация ожидает подтверждения модератором.'}else{org_info=2; var status = 'Организация подтверждена.'}
          var info = {};
          info.org_name = resp.rows[0].org_name;
          info.org_address = resp.rows[0].org_address;
          info.owner_inn = resp.rows[0].owner_inn;
          info.position = resp.rows[0].owner_position;
          info.status = status;
        }
        var deals = 0;
        db.any(getUserDeals).then(function(data) {
          if(data){deals = data;}
          var dealsdata = {};
          var d_data = [];
          for (var x = 0; x<data.length; x++){
            if(!dealsdata[data[x].deal_id]){dealsdata[data[x].deal_id] = []; dealsdata[data[x].deal_id].id = data[x].deal_id;}
            if(dealsdata[data[x].deal_id]){dealsdata[data[x].deal_id].push(data[x].product+" "+data[x].count+" шт.")}
          }
          var deals_count = Object.keys(dealsdata).length;
          console.log("You have: ",deals_count," deals");
          for(key in dealsdata){
            d_data.push(dealsdata[key]);
          }
          console.log(d_data);
          res.render('user',{
            isRegistred: req.session.userId,
            user_name: response.rows[0].name,
            user_second_name: response.rows[0].second_name,
            number: response.rows[0].number,
            phone_confirmed: response.rows[0].phone_confirmed,
            type: response.rows[0].client_type,
            org_info: org_info,
            balance:response.rows[0].balance,
            info: info,
            deals: d_data
          });
        }).catch(error => {
          console.log('ERROR:', error);
        });
      });
    }
  });
}).post(function(req,res){
    var getUserData = `SELECT * FROM users WHERE id='`+req.session.userId+`'`;
    if((req.body.name)&&(req.body.sname)){
      pgPool.query(getUserData,[], function(err, response){
        if((!response.rows[0].name)&&(!response.rows[0].second_name)){
          var add_name_and_sname = `UPDATE users SET name='`+req.body.name+`', second_name='`+req.body.sname+`' WHERE id='`+req.session.userId+`'`;
          pgPool.query(add_name_and_sname,[], function(err, response){});
        }
      });
    }else if(true){
      console.log(req.body)
      var get_org = `SELECT * FROM organizations WHERE owner_id='`+req.session.userId+`'`;
      pgPool.query(get_org,[], function(err, response){
          if(!response.rows[0]){
            db.none('INSERT INTO organizations(org_name, org_address, owner_inn, owner_id, org_confirmed, owner_position) VALUES(${org_name}, ${org_address}, ${owner_inn}, ${owner_id}, ${org_confirmed}, ${owner_position})',  {
              org_name: req.body.org_name,
              org_address: req.body.org_address,
              owner_inn: req.body.inn,
              owner_id: req.session.userId,
              org_confirmed: 0,
              owner_position: req.body.position
            });
          }
      });
    }
    res.redirect('/user');
});

module.exports = user;
