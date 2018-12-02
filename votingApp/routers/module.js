var electionModule = require('./configuration.js');
var db = require('../Database/db.js');

var Election = electionModule.election;
var Web3 = electionModule.web3Module;

var listAccount = Web3.eth.accounts;

// add votesr
exports.InserVoterdata = function(req,res){
    var Address = req.body.voterAddress;
    var FName = req.body.voterfastName;
    var LName = req.body.voterlastName;
    var Gender = req.body.voterGender;

    Election.addVoterData(Address,FName,LName,Gender,{gas:400000});
    res.redirect('/addVoterdata');
};
// get accounts List and add this list in Database

 exports.AddVoterPage = function(req,res) {

 var query = db.query('SELECT * FROM etheraddress',function(err,rows){
                if(err){
                      console.log("Error Selecting : %s ",err );
                } else {
                  res.render('Addvoterdata',{page_title:"Add Voter",data:rows});
                }
             });
};


exports.Allvoter = function(req,res){
	
	 var query = db.query('SELECT * FROM voters',function(err,rows){
                if(err){
                      console.log("Error Selecting : %s ",err );
                } else {
                  res.render('tables',{page_title:"candidatedata1",data:rows});
                }
             });
	
};


exports.index = function(req,res){

 var query = db.query('SELECT * FROM candidatewl',function(err,rows){
                if(err){
                      console.log("Error Selecting : %s ",err );
                } else {
                  res.render('index',{page_title:"candidatedata1",data:rows});
                }
             });
};
//set account list in account select list box

exports.votingUI = function(req,res){
addAcountsInDB();
var query = db.query('SELECT voterAddress FROM voters',function(err,rows){
               if(err){
                     console.log("Error Selecting : %s ",err );
               } else {
                 res.render('E-voting',{page_title:"E voting System",data:rows});
               }
            });
};

// votesr vote to candidate using candidate ID and voter Address
exports.Evote = function(req,res){
  console.log(req.body);

  var votefor =  Election.vote(req.body.Id,req.body.voterAddress,{gas:400000});
  
  addressdata = req.body.voterAddress;
  
  console.log("call  event");
  console.log(typeof(addressdata));
  console.log(typeof(req.body.voterAddress));
  
  console.log(addressdata);
  
  var evoter = Election.votingLog(function(err,result){
    if(!err){
      console.log(result.args._voterStatus);
	  
	  var query = db.query('UPDATE voters SET voterVoted=1 WHERE voterAddress=' + addressdata);
	  //console.log(query);
    }
  });
  res.redirect('/');
};

exports.winl = function(req,res){
  console.log(req.body);
  var votefor =  Election.winer({gas:400000});
  console.log("call  event");
  var evoter = Election.winnerData(function(err,result){
    if(!err){
      console.log(result.args);
    }
  });
  
  res.redirect('/Dashboard');
};




exports.candata = function(req,res){
  
  db.query("DELETE FROM candidatewl", function(err, rows)
  {
        if (err)
            console.log("Error inserting : %s ",err );
    });
  
  Election.winnerData(function(err,result){
  if(!err){
  if(result.args._id.toString()!=0){
  var datain = {
   candidateID : result.args._id.toString(),
   candidtaeName : result.args._name,
   voteCount : result.args._voteCount.toString(),
   parcentage : result.args._parcetange.toString(),
   marginwl : result.args.marginWL.toString(),
   winloss : result.args._winloss
 };
 console.log(datain);
  
 db.query("INSERT INTO candidatewl set ? ",datain, function(err, rows)
  {
        if (err)
            console.log("Error inserting : %s ",err );
    });
  }
  } else{
    console.log(err);
  }
});
  
  res.redirect('/Dashboard');

  
};


function addAcountsInDB(){
   deleteRecord();
  var records = [];
  for(var ii=0; ii<listAccount.length; ii++){
    records.push([listAccount[ii]]);
  }
  var sql = "INSERT INTO etheraddress (address) VALUES ?";
  var query = db.query(sql, [records], function(err, result) {
    if (err)
        console.log("Error inserting : %s ",err );
      console.log(result);
  });
}

function deleteRecord(){
  var sql = "DELETE FROM etheraddress";
   db.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Number of records deleted: " + result.affectedRows);
 });
}
