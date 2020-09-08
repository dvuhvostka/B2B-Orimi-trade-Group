const express = require('express');
const user = express.Router();
const path = require('path');
const app = require('../app');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('../config');
const {Pool, Client} = require('pg');
const multer = require('multer');
const fs = require('fs');
const rimraf = require('rimraf');
const ncp = require('ncp').ncp;
var crypto = require("crypto");

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

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('./public/images/uploads/'+req.session.userId, err=>{});
    cb(null, './public/images/uploads/'+req.session.userId);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({
  storage: storage,
  limits: {fileSize: 5 * 1024 * 1024},
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext!='.jpg'&&ext!='.jpeg'&&ext!='.png'){
      const err = new Error('Extension');
      err.code = "EXTENSION";
      return cb(err);
    }
    cb(null, true);
  }
}).any();

user.route('/user')
.get(redirectLogin, function(req, res, next) {
  var getUserData = `SELECT * FROM users WHERE id='`+req.session.userId+`'`;
  pgPool.query(getUserData,[], function(err, response){
    if(response.rows[0]){
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
          info.link_code = resp.rows[0].link_code;
        }
        var deals = 0;

        var getUserDeals = `SELECT * FROM deals WHERE deal_owner='`+req.session.userId+`'`;

        db.any(getUserDeals).then(function(data) {
          if(data){deals = data;}
          var dealsdata = {};
          var d_data = [];
          for (var x = 0; x<data.length; x++){
            if(!dealsdata[data[x].deal_id]){dealsdata[data[x].deal_id] = []; dealsdata[data[x].deal_id].id = data[x].deal_id; dealsdata[data[x].deal_id].deal_owner = data[x].deal_owner;}
            if(dealsdata[data[x].deal_id]){dealsdata[data[x].deal_id].push(data[x].product+":"+data[x].count+":"+data[x].product_id+":"+data[x].sort+":"+data[x].type+":"+data[x].price_of_one+":"+data[x].full_price)}
          }
          for(key in dealsdata){
            d_data.push(dealsdata[key]);
          }

          let getUserorg = `SELECT * FROM organizations WHERE link_code LIKE '`+response.rows[0].link_code+`'`;
          db.any(getUserorg).then(function(userorgdata){
            let attachedorg;
            if(userorgdata.length==0){
              attachedorg = 0;
              db.none("UPDATE users SET link_code='' WHERE id='"+req.session.userId+"'");
            }else{
              attachedorg = userorgdata[0];
            }
            if (response.rows[0].permissions=='mod'){
              db.any(`SELECT * FROM organizations WHERE org_confirmed=0`).then(function(uncorgs){
                for(var i=0; i<uncorgs.length; i++){
                  var fls = fs.readdirSync('./public/images/uploads/'+uncorgs[i].owner_id);
                  uncorgs[i].docs = fls;
                }
                db.any(`SELECT * FROM deals_info`).then(function(deals_info){
                  res.render('user',{
                    title: "Аккаунт",
                    isRegistred: req.session.userId,
                    user_name: response.rows[0].username,
                    user_second_name: response.rows[0].second_name,
                    user_third_name: response.rows[0].third_name,
                    number: response.rows[0].number,
                    phone_confirmed: response.rows[0].phone_confirmed,
                    type: response.rows[0].client_type,
                    permissions: response.rows[0].permissions,
                    balance: response.rows[0].balance,
                    org_info: org_info,
                    info: info,
                    deals: d_data,
                    deals_info: deals_info,
                    uncorgs: uncorgs,
                    link_code: response.rows[0].link_code,
                    attached_org: attachedorg
                  });
                });
              }).catch(error => {
                console.log('ERROR:', error);
              });
            }else{
              console.log(response.rows[0].permissions);
              res.render('user',{
                title: "Аккаунт",
                isRegistred: req.session.userId,
                user_name: response.rows[0].username,
                user_second_name: response.rows[0].second_name,
                user_third_name: response.rows[0].third_name,
                number: response.rows[0].number,
                phone_confirmed: response.rows[0].phone_confirmed,
                type: response.rows[0].client_type,
                permissions: response.rows[0].permissions,
                balance: response.rows[0].balance,
                org_info: org_info,
                info: info,
                deals: d_data,
                link_code: response.rows[0].link_code,
                attached_org: attachedorg
              });
            }
          });
        }).catch(error => {
          console.log('ERROR:', error);
        });
      });
    }
  });
}).post(function(req,res,next){
    var error;
    if(req.body.post_type=='leave_org'){
      if(req.session.userId){
        db.none("UPDATE users SET link_code='' WHERE id='"+req.session.userId+"'");
      }
      let res_ok = "Вы успешно покинули организацию.";
      res.json({
        ok: true,
        res_ok
      });
    }else if(req.body.post_type=='add_code'){
      console.log(req.body.post_data);
      let xss_pattern = /`|'|"/gim;
      if(req.body.post_data.match(xss_pattern)){
          console.log('!XSS! from: '+req.ip);
          let error = "Введен неверный пригласительный код";
          res.json({
            ok: false,
            error
          });
      }else{
        let getUserorg = `SELECT * FROM organizations WHERE link_code LIKE '`+req.body.post_data+`'`;
        db.any(getUserorg).then(function(userorgdata){
          if(userorgdata.length!=1){
            let error = "Введен неверный пригласительный код";
            res.json({
              ok: false,
              error
            });
          }else if(userorgdata.length==1){
            db.none("UPDATE users SET link_code='"+req.body.post_data+"' WHERE id='"+req.session.userId+"'");
            let confirmed_code_status = "Вы успешно добавлены в список сотрудников организации."
            res.json({
              ok: true,
              confirmed_code_status
            });
          }
        });
      }
    }else if(req.body.post_type=="delete_org_skdjfgh213asRQadSKSFD3123244"){
      db.none("DELETE FROM organizations WHERE owner_id='"+req.body.org_owner_id+"'");
      rimraf('./public/images/uploads/'+req.body.org_owner_id, function () { console.log('done'); });
      console.log("Organiztion deleted from user: "+req.body.org_owner_id);
    }else if(req.body.post_type=="confirm_org_askdjfhl123123kaGFDGdfhFsdf3123"){
      db.none("UPDATE organizations SET org_confirmed=1 WHERE owner_id='"+req.body.org_owner_id+"'");
      db.none("UPDATE users SET balance=balance+200 WHERE id='"+req.body.org_owner_id+"'");
      ncp.limit = 16;
      var srcPath = './public/images/uploads/'+req.body.org_owner_id; //current folder
      fs.mkdir('./public/images/confirmed_uploads/'+req.body.org_owner_id, err=>{});
      console.log('confirmed_uploads created: done');
      var destPath = './public/images/confirmed_uploads/'+req.body.org_owner_id; //Any destination folder
      ncp(srcPath, destPath, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log('Copying files: done');
        rimraf('./public/images/uploads/'+req.body.org_owner_id, function () { console.log('uploads deleted: done'); });
      });
      console.log("org confirmed: "+req.body.org_owner_id+" done");
      var link_code = crypto.randomBytes(20).toString('hex');
      console.log("link code generated: " +link_code);
      db.none("UPDATE organizations SET link_code='"+link_code+"' WHERE owner_id='"+req.body.org_owner_id+"'");
    }else if (req.body.post_type == 'request') {
      console.log('add request')
      db.none("INSERT INTO requests_from_organizations(request, org_id) VALUES (${request},${org_id})",{
        request: req.body.request,
        org_id: req.session.userId,
      }).then(() =>{
          console.log(123);
          res.json({
            ok: true
          })
        }
      ).catch(error => {
        console.log(error);
        res.json({
          ok:false
        })
      });
    }else{
        upload(req, res, err => {
          if (err == undefined){
            var getUserData = `SELECT * FROM users WHERE id='`+req.session.userId+`'`;
            var get_org = `SELECT * FROM organizations WHERE owner_id='`+req.session.userId+`'`;
            pgPool.query(get_org,[], function(err, response){
              pgPool.query(getUserData,[], function(error, resp){
                  if(!response.rows[0]){
                    db.none('INSERT INTO organizations(org_name, org_address, owner_inn, owner_id, org_confirmed, owner_position, owner_name, owner_sname, owner_tname, type) VALUES(${org_name}, ${org_address}, ${owner_inn}, ${owner_id}, ${org_confirmed}, ${owner_position}, ${owner_name}, ${owner_sname}, ${owner_tname}, ${type})',  {
                      org_name: req.body.org_name,
                      org_address: req.body.org_address,
                      owner_inn: req.body.inn,
                      owner_id: req.session.userId,
                      type: req.body.type,
                      org_confirmed: 0,
                      owner_position: req.body.position,
                      owner_name: resp.rows[0].username,
                      owner_sname: resp.rows[0].second_name,
                      owner_tname: resp.rows[0].third_name,
                    });
                  }
              });
            });
            res.json({
              ok: !error,
              error
            });
          }else if(err.code == 'EXTENSION'){
            error = 'Неверный формат файла. (Только JPG и PNG)';
            console.log(error);
            res.json({
              ok: !error,
              error
            });
          }else if(err.code == 'LIMIT_FILE_SIZE'){
            error = 'Слишком большой файл. Допустимо не более 5 м/байт.';
            console.log(error);
            res.json({
              ok: !error,
              error
            });
          }
        });
    }
});

module.exports = user;
