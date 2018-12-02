exports.Home = function(req,res){
    res.render('index', { title: 'BlockChain' });
};
exports.addvoterPage = function(req,res) {
  res.render('addVoterdata',{title: 'add voter'});
};
exports.Dashboard = function(req,res) {
  res.render('index',{title: 'Dashboard view'});
};

exports.Evoting = function(req,res){
  res.render('E-voting',{title: 'E-voting Dapp'});
};
