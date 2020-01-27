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

  var settings = {};

  var SimWorker = function(data) {
    var $this = this;
    var uuid = data.uuid;

    $this.thread = new Worker("./worker.sim.js");
    $this.uuid = uuid;
    $this.teams = data.teams;
    $this.conditions = data.conditions;

    $this.thread.postMessage({
      cmd: "init",
      uuid: uuid
    });

    $this.queue = [];

    this.thread.onmessage = simulationListener;
  };

  SimWorker.prototype.setListener = function(func) {
    this.thread.onmessage = func;
  };

  SimWorker.prototype.setupCombat = function() {
    this.thread.postMessage({
      cmd: "setup",
      teams: this.teams,
      conditions: this.conditions
    });
  };

  // Local variables
  var simWorkers = {};

  addEventListener('message',function(event) {
    var message = event.data;

    // Which command was sent?
    if(message.cmd === "init") {
      // Save the ID for this ForemanWorker and the available commands
      settings.uuid = message.uuid;
      settings.commands = message.commands;
    }
    else if(message.cmd === "setup") {
      var data = message.data;
      var uuid = data.uuid;
      console.info(`Setting up combat ${uuid}`);
      var w = new SimWorker(data);
      //w.setListener(simulationListener);
      simWorkers[uuid] = w;
    }
    else if(message.cmd === "start") {}
    else if(message.cmd === "status") {}
    else if(message.cmd === "pause") {}
    else if(message.cmd === "term") {}
  });

  addEventListener('message',function(event) {
    var message = event.data;

    if(message.cmd === "check") {
      console.log("Received check command");
    }
  });

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
    else if(message.cmd === "reg") {
      var uuid = message.uuid;
      simWorkers[uuid].setupCombat()
    }
    else if(message.cmd === "ready") {
      console.info(`SimWorker ${message.uuid} is ready!`);
    }
  };
})();
