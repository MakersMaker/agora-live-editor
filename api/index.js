const express = require('express');

app = express();
app.use(express.static('./public'));
console.log('Server listening at port 8082');
app.listen(8082);
