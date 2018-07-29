const express = require('express');
const cors = require('cors');

app = express();

app.use(cors());
app.use(express.static('./public'));
app.listen(8082);

console.log('Server listening at port 8082');
