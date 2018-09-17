const express = require('express');
const cors = require('cors');
const dirTree = require('directory-tree');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');


const config = {
  filesPath: './public/files'
}

app = express();
app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());

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

const server = app.listen(process.env.PORT || 8082);
const io = require('socket.io')(server);
console.log('Server listening at port 8082');

io.on('connection' , (socket)=>{
  socket.on('send', (data)=>{
    socket.broadcast.emit('recive', data);
  })
})

function getFileTree(dir) {
  return dirTree(dir);
}
