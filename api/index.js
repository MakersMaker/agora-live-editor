const express = require('express');
const cors = require('cors');
const path = require('path');
const dirTree = require('directory-tree');
const bodyParser = require('body-parser');
const fs = require('fs');


const config = {
  filesPath: './public/files'
};

app = express();
app.use(cors());
app.use(express.static( './public'));
app.use(bodyParser.json());

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);


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

const server = app.listen(process.env.PORT || 8081);
const io = require('socket.io')(server);
console.log('Server listening at port 8081');

io.on('connection' , (socket)=>{
  socket.on('codeSend', (data)=>{
    socket.broadcast.emit('codeRecive', data);
  });
  // socket.on('messageSend' , (data)=>{
  //   socket.broadcast.emit('messageRecive', data);
  // });
});

function getFileTree(dir) {
  return dirTree(dir);
}
