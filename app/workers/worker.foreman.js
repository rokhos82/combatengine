(function () {
  /*
  **  Foreman Worker - this thread communicates with the overseer module
  ** and controls the individual simulation workers.
  ** Receives commands from the overseer and creates/directs the simulation
  ** workers.
  */

  console.info("Setting up foreman Worker");

  // Import utility scripts
  importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.js");

  // Register message handler
  onmessage = function(event) {
    var message = event.data;

    // Which command was sent?
    if(message.cmd === "setup") {
      console.info(message.data);
    }
    else if(message.cmd === "start") {}
    else if(message.cmd === "status") {}
    else if(message.cmd === "pause") {}
    else if(message.cmd === "term") {}
  };

  function setupCombat() {}

  function startCombat() {}

  function statusCheckCombat() {}

  function pauseCombat() {}

  function terminateCombat() {}
})();
