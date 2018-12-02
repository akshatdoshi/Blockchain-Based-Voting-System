var db = require('../Database/db.js');
var express = require('express'),
app = express();
var Web3 =require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider ("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0];

var electionDB = web3.eth.contract([
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "partyName",
          "type": "string"
        },
        {
          "name": "voteCount",
          "type": "uint256"
        },
        {
          "name": "parcetange",
          "type": "uint256"
        },
        {
          "name": "marginWL",
          "type": "uint256"
        },
        {
          "name": "winloss",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "VoterData",
      "outputs": [
        {
          "name": "voterID",
          "type": "uint256"
        },
        {
          "name": "voterAddress",
          "type": "address"
        },
        {
          "name": "voterFastName",
          "type": "string"
        },
        {
          "name": "voterLastName",
          "type": "string"
        },
        {
          "name": "voterGender",
          "type": "uint256"
        },
        {
          "name": "voterVoted",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_candidateId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_candidateName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_partyName",
          "type": "string"
        }
      ],
      "name": "addCandidateEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_voterId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_voterAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_voterFastName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_voterLastName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_voterGender",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_voterVoted",
          "type": "bool"
        }
      ],
      "name": "addVoterEvent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_errorLog",
          "type": "string"
        }
      ],
      "name": "errorLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_voterStatus",
          "type": "string"
        }
      ],
      "name": "votingLog",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_winName",
          "type": "string"
        }
      ],
      "name": "winerName",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_name",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_partyName",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "_voteCount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_parcetange",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "marginWL",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "_winloss",
          "type": "string"
        }
      ],
      "name": "winnerData",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_partyName",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_Address",
          "type": "address"
        },
        {
          "name": "_FName",
          "type": "string"
        },
        {
          "name": "_LName",
          "type": "string"
        },
        {
          "name": "_Gender",
          "type": "uint256"
        }
      ],
      "name": "addVoterData",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_candidateId",
          "type": "uint256"
        },
        {
          "name": "_voterAddress",
          "type": "address"
        }
      ],
      "name": "vote",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "winer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]);
var Election = electionDB.at("0x71da396726c6b181bd7707226350bd87eee555c8");

var eventAddvoter = Election.addVoterEvent({_from:web3.eth.coinbase},{fromBlock:'latest', toBlock :'latest'});


eventAddvoter.watch(function(error, result){
  if (error)
  {
    console.log("Error inserting : %s ",error );
  } else {
    var insertData = {
      voterID : parseInt(result.args._voterId.toString()),
      voterAddress : result.args._voterAddress,
      voterFastName : result.args._voterFastName,
      voterLastName : result.args._voterLastName,
      voterGender : parseInt(result.args._voterGender.toString()),
      voterVoted : result.args._voterVoted,
      TranscationHash : result.transactionHash
    };
      console.log(result);
      var query = db.query("INSERT INTO voters set ? ",insertData, function(err, rows)
      {
            if (err)
                console.log("Error inserting : %s ",err );
        });
  }
});



exports.election = Election;
exports.web3Module = web3;
