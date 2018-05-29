let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    axios = require('axios'),
    redis = require('redis'),
    query = require('./mysql');
    client = redis.createClient();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

let appid = 'wx0f3091f747b37832',
    appsecret = 'd85dd12090f55ee18eb1e123d647edd7';

client.hmset('session',{'openid':'asdf123','session_key':'sdfhgdfsgsdfhh2'},err=>{
  console.log(err);
});

client.hgetall('session',(err,obj)=>{
  console.log(obj);
});

let querySomeOne = (openid,cb) =>{
  console.log(openid);
  query('select nickName,avatarUrl,gender,city,province,country,language from users where openid = "'+openid+'" order by id desc',(qerr,vals,fields)=>{
    if(qerr) {
      console.log(qerr);
    }
    console.log(vals);

    typeof cb === 'function' && cb(vals);
  })
};

app.get('/api/queryUser',(req,res)=>{
  let openid = req.query.id;

  console.log(openid,req.query);

  querySomeOne(openid,vals=>{
    console.log(vals,'------queryUser-----')
    if(vals.length !== 0) {
      res.send({
        code:2000,
        data:vals
      })
    } else {
      res.send({
        code:4004,
        data:[]
      })
    }
  });



});

app.post('/api/setUserInfo',(req,res)=>{
  console.log(req);

  let obj = req.body;

  query('set names utf8',(qrr,vals,fields)=>{});

  query(`insert into users (openid,nickName,avatarUrl,gender,city,province,country,language) values ('${obj.openid}','${obj.nickName}','${obj.avatarUrl}','${obj.gender}','${obj.city}','${obj.province}','${obj.country}','${obj.language}')`,(qerr,vals,fields)=>{
    if(qerr) {
      console.log(qerr);
    }
    console.log(vals);
  });

  res.send({
    code:2000,
    data:[]
  });


});

app.get('/api/getUserInfo',(req,res)=>{
    let code = req.query.code;

    console.log(code);


    axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`)
      .then(s=>{
          if(s.data) {
            console.log(s.data);
            let data = s.data,
                hadRecord = false,
                recordData={};

            querySomeOne(data.openid,vals=>{
              if(vals.length !== 0) {
                hadRecord = true;
                recordData = vals;
              }

              res.send({
                code:2000,
                data:{
                  clientId:data.openid,
                  hadRecord:hadRecord,
                  record:recordData
                }
              })
            });


          }
      })
      .catch(error=>{

          console.log(error)
      })

});

app.listen(8007);