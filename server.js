const CLIENT_ID = ""
const CLIENT_SECRET = ""

const axios = require('axios');

var express = require('express')
var cors = require('cors')
 var bodyParser = require('body-parser')

 var app = express()
 app.use(cors())
 app.use(bodyParser.json());

 app.listen(4000,function(){
   console.log('server running on 4000');
})

app.get('/login/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: req.query.code,
  });

  axios.post('https://github.com/login/oauth/access_token', params, {
    headers: { Accept: 'application/json' },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

 app.get('/getUserdata',async function (req,res){
  console.log("inside getuserdata");
   req.get("Authorization");
   console.log( req.get("Authorization"));
   await axios.get("https://api.github.com/user",{
      headers:{
         "Authorization": req.get("Authorization")
      }
   }).then((response)=>{
      console.log(response.data);
      res.send(response.data)
    })
 })