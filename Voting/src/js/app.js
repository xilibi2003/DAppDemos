App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545")
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Voting.json', function(data) {
      App.contracts.Voting = TruffleContract(data);
      App.contracts.Voting.setProvider(App.web3Provider);

      return App.initData();
   });

   return App.bindEvents();
  },

  bindEvents: function() {
    $("#vote").on("click", App.voteForCandidate);
  },

  initData: function() {
    let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}
    let candidateNames = Object.keys(candidates);
    for (var i = 0; i < candidateNames.length; i++) {
      let name = candidateNames[i];

      App.contracts.Voting.deployed().then(function(contractInstance) {
          return contractInstance.totalVotesFor(name);
        }).then(function(v) {
          console.log(v);
          $("#" + candidates[name]).html(v.toString());
        }).catch(function(err) {
          console.log(err.message);
        });
      }
  },

  voteForCandidate: function() {
    let candidateName = $("#candidate").val();
    try {
      $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
      $("#candidate").val("");

      App.contracts.Voting.deployed().then(function(contractInstance) {
        contractInstance.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
          let div_id = candidates[candidateName];
          return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
            $("#" + div_id).html(v.toString());
            $("#msg").html("");
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
