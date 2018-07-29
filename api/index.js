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
  console.log(postBody);

  if (!postBody.fileName) return res.send({ done: false });
  const filePath = path.join(config.filesPath, postBody.fileName);
  fs.writeFile(filePath, postBody.content, (err) => {
    if (!err) res.send({ done: true });
  });
});

app.listen(process.env.API_PORT || 8082);
console.log('Server listening at port 8082');

function getFileTree(dir) {
  return dirTree(dir);
}
