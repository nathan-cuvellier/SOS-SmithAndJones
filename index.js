let express = require('express');
let app = express();
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.render(__dirname + '/public/index.ejs',);
});

app.listen(8080);