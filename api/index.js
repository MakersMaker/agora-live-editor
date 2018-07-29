const express = require('express');
const cors = require('cors');
const dirTree = require('directory-tree');

app = express();

app.use(cors());
app.use(express.static('./public'));
app.get('/files', (req, res) => {
  const files = getFileTree('./public/files/');
  res.send(files);
})
app.listen(8082);

console.log('Server listening at port 8082');

function getFileTree(dir) {
  return dirTree(dir);
}
