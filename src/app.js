let express = require('express'),
    app = express(),
    axios = require('axios'),
    redis = require('redis'),
    client = redis.createClient();

let appid = 'wx0f3091f747b37832',
    appsecret = 'd85dd12090f55ee18eb1e123d647edd7';

client.hmset('session',{'openid':'asdf123','session_key':'sdfhgdfsgsdfhh2'},err=>{
  console.log(err);
});

client.hgetall('session',(err,obj)=>{
  console.log(obj);
});

setTimeout(()=>{
  client.hgetall('session',(err,obj)=>{
    console.log(obj);
  });
},3000);

app.get('/api/getcode',(req,res)=>{
    let code = req.query.code;

    console.log(code);


    axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`)
      .then(res=>{
          if(res.data) {
            console.log(res.data);
            let data = res.data;
            res.send({
              code:2000,
              data:{
                clientId:data.openid
              }
            })
          }
      })
      .catch(error=>{

          console.log(error)
      })

});

app.listen(8007);