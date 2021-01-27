App = {
  web3Provider: null,
  contracts: {},

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
         App.web3Provider = web3.currentProvider
         web3 = new Web3(App.web3Provider);
     } else {
         App.web3Provider = new Web3.providers.HttpProvider("http://localhost:9545")
         web3 = new Web3(App.web3Provider);
     }

     return App.initContract();
  },

  initContract: function() {

    $.getJSON('InfoContract.json', function(data){
      App.contracts.InfoContract = TruffleContract(data);
      App.contracts.InfoContract.setProvider(App.web3Provider);

      App.getInfo();
      App.watchChanged();
    });

    App.bindEvents();

  },

  getInfo: function() {
    App.contracts.InfoContract.deployed().then(function(instance) {
      return instance.getInfo.call();
    }).then(function(result) {
      $("#loader").hide();
      $("#info").html(result[0]+' ('+result[1]+' years old)');
      console.log(result);
    }).catch(function(err) {
      console.error(err);
    });
  },

  bindEvents: function() {
    $("#button").click(function() {
        $("#loader").show();

        App.contracts.InfoContract.deployed().then(function(instance) {
          return instance.setInfo($("#name").val(), $("#age").val(), {gas: 500000});
        }).then(function(result) {
          return App.getInfo();
        } ).catch(function(err) {
          console.error(err);
        });
      });
  },

  watchChanged: function() {
    App.contracts.InfoContract.deployed().then(function(instance) {
      var infoEvent = instance.Instructor();
      return infoEvent.watch(function(err, result) {
        $("#loader").hide();
        $("#info").html(result.args.name +' ('+ result.args.age +' years old)');
      });
    });
  }

  }



$(function(){
  $(window).load(function() {
      App.init();
  });
});
