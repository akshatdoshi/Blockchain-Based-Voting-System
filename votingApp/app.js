
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var routes = require('./routers/pages.js');
var modules = require('./routers/module.js');

var port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || port);

app.get('/',modules.votingUI);
app.post('/Evoting/voter',modules.Evote);

app.get('/winloss',modules.winl);
app.get('/candata',modules.candata);

app.get('/Addvoterdata',modules.AddVoterPage);
app.post('/Addvoterdata',modules.InserVoterdata);

app.get('/Dashboard',modules.index);
app.get('/VoterData',modules.Allvoter);


app.listen(port, function() {
  console.log("Listening on " + port);

});