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

  var SimWorker = function(uuid) {
    var $this = this;

    $this.thread = new Worker("./worker.sim.js");
    $this.uuid = uuid;

    $this.thread.postMessage({
      cmd: "init",
      data: {
        uuid: uuid
      }
    });

    $this.queue = [];
  };

  SimWorker.prototype.setListener = function(func) {
    this.thread.onmessage = func;
  };

  // Local variables
  var simWorkers = {};

  // Register message handler
  onmessage = function(event) {
    var message = event.data;

    // Which command was sent?
    if(message.cmd === "setup") {
      var uuid = message.data.uuid;
      console.info(`Setting up combat ${uuid}`);
      var w = new SimWorker(uuid);
      w.setListenter(simulationListener);
      simWorkers[uuid] = w;
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

  function simulationListener(event) {
    var message = event.data;

    if(message.cmd === "init") {
      // Initilization is done
      var uuid = message.data.uuid;
      simWorkers[uuid].postMessage();
    }
  };
})();
