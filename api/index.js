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


const server = https.createServer(options,app).listen(httpsPort, (req,res) =>{
  console.log("Https server listening on port " + httpsPort);
});

http.createServer(app).listen(httpPort, function(){  
  console.log("Http server listening on port " + httpPort);
});

const io = require('socket.io')(server);

io.on('connection' , (socket)=>{
  socket.on('codeSend', (data)=>{
    console.log("asdf");
    socket.broadcast.emit('codeRecive', data);
  });
  socket.on('messageSend' , (data)=>{
    socket.broadcast.emit('messageRecive', data);
  });
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


function getFileTree(dir) {
  return dirTree(dir);
}


