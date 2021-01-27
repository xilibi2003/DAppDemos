App = {
  web3Provider: null,
  Voting: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      this.provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    }  else if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545")
      web3 = new Web3(App.web3Provider);
    }
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
    let weivalue = web3.toWei(ethvalue, 'ether');

    App.Voting.deployed().then(function(contractInstance) {
        return contractInstance.voteForCandidate(candidateName, {value: weivalue});
      }).then(function(v) {
        App.initData();
      }).catch(function(err) {
        console.log(err.message);
      });

  }


};



$(function() {
  $(window).load(function() {
    App.init();
  });
});
