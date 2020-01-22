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

    if(message.cmd === "init") {}
  };

  setTimeout(function() {
    postMessage("Hello from foreman");
  },5000);
})();
