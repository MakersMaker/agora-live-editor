const express = require('express');
const cors = require('cors');
const path = require('path');
const dirTree = require('directory-tree');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const http = require('http');

const config = {
  filesPath: './public/files'
};

const options = {
	key: fs.readFileSync('./keys/private.pem'),
	cert: fs.readFileSync('./keys/public.pem')
};

app = express();
app.use(cors());
app.use(express.static('./public' ));
app.use(bodyParser.json());
app.use(express.urlencoded());


app.set('views', __dirname +  '/public');
app.engine('html', require('ejs').renderFile);

var httpPort = 8082;
var httpsPort = 8081;




https.createServer(options,app).listen(httpsPort, (req,res) =>{
  console.log("Https server listening on port " + httpsPort);
});

const server = http.createServer(app).listen(httpPort, function(){  
  console.log("Http server listening on port " + httpPort);
});

const io = require('socket.io')(server);
io.on('connection' , (socket)=>{
  socket.on('codeSend', (data)=>{
    socket.broadcast.emit('codeRecive', data);
  });
  // socket.on('messageSend' , (data)=>{
  //   socket.broadcast.emit('messageRecive', data);
  // });
});

app.get('/filestree', (req, res) => {
  const files = getFileTree(config.filesPath);
  res.send(files);
});

app.post('/files', (req, res) => {
  const postBody = req.body;
  console.log(postBody.fileName);

  if (!postBody.fileName) return res.send({ done: false });
  const filePath = path.join(config.filesPath, postBody.fileName);
  fs.writeFile(filePath, postBody.content, (err) => {
    if (!err) res.send({ done: true });
  });
});

app.get('/lecturePage' , (req,res)=>{
  res.render('lecturePage.html');
})

app.get('/login', function (req, res){  
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h3>Login</h3>');
  res.write('<form method="POST" action="/login">');
  res.write('<label name="userId">UserId : </label>')
  res.write('<input type="text" name="userId"><br/>');
  res.write('<label name="password">Password : </label>')
  res.write('<input type="password" name="password"><br/>');
  res.write('<input type="submit" name="login" value="Login">');
  res.write('</form>');
  res.end();
})


function getFileTree(dir) {
  return dirTree(dir);
}


