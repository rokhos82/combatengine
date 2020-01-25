(function () {
  /*
  ** Main Simulation Worker
  */

  console.info("Creating simulation worker")

  importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.js");

  onmessage = function(event) {
    var message = event.data;

    if(message.cmd === "init") {
      console.info("Simulation worker ID: ",message.data.uuid);
    }
    else if(message.cmd === "setup") {}
  };

  function setupCombat() {}
})();
