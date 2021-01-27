App = {
  web3Provider: null,
  Voting: null,
  web3: null,
  accounts: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        App.accounts = await ethereum.send('eth_requestAccounts')
        console.log("accounts: " + App.accounts.result[0]);
        App.account = App.accounts.result[0];
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545")
    }
    App.web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {

    $.getJSON('Voting.json', function (data) {
        App.Voting = TruffleContract(data);
        App.Voting.setProvider(App.web3Provider);

        return App.initData();
    });
    $("#vote").on("click", App.voteForCandidate);
  },

  initData: function() {
    let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}
    let candidateNames = Object.keys(candidates);
    for (var i = 0; i < candidateNames.length; i++) {
      let name = candidateNames[i];

      App.Voting.deployed().then(function(contractInstance) {
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
    let ethvalue = $("#value").val();   // ether
    let weivalue = App.web3.toWei(ethvalue, 'ether');

    App.Voting.deployed().then(function(contractInstance) {
        return contractInstance.voteForCandidate(candidateName, {value: weivalue, from: App.account });
      }).then(function(v) {
        App.initData();
      }).catch(function(err) {
        console.log("vate:" + err.message);
      });

  }


};



$(function() {
  $(window).load(function() {
    App.init();
  });
});
