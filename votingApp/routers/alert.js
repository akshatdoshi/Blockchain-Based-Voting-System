var electionModule = require('./configuration.js');
var Election = electionModule.election;
var Web3 = electionModule.web3Module;

var eventLogerr = Election.errorLog({_from:web3.eth.coinbase},{fromBlock:'latest', toBlock :'latest'});


eventLogerr.watch(function(err,result){
  if(!err){
     //res.render('E-voting',{page_title:"E voting System",data:result._errorLog});
     Document.getElementById('sms').value = result.args._errorLog;
     console.log(result.args._errorLog);
  }
});
