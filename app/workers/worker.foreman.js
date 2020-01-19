(function () {
  /*
  **  Foreman Worker - this thread communicates with the overseer module
  ** and controls the individual simulation workers.
  ** Receives commands from the overseer and creates/directs the simulation
  ** workers.
  */

  // Import utility scripts
  importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.js");

  // Register message handler
  onmessage = function(event) {
    var message = event.data;

    if(message.cmd === "init") {}
  };
})();
