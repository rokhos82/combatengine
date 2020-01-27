(function () {
  /*
  ** Main Simulation Worker
  */

  console.info("Creating simulation worker")

  // Import utility scripts
  importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.js");

  var settings = {};

  var PoolWorker = function(uuid) {
    var $this = this;

    $this.thread = new Worker("./worker.pool.js");
    $this.uuid = uuid;

    $this.thread.postMessage({
      cmd: "init",
      data: {
        uuid: uuid
      }
    });
  };

  onmessage = function(event) {
    var message = event.data;

    if(message.cmd === "init") {
      // Do thread initialization tasks such as saving the UUID for the thread.
      console.info("Simulation worker ID: ",message.uuid);
      settings.uuid = message.uuid;

      // Register with the ForemanWorker
      postMessage({
        cmd: "reg",
        uuid: settings.uuid
      });
    }
    else if(message.cmd === "setup") {}
    else if(message.cmd === "ready") {}
    else if(message.cmd === "start") {}
    else if(message.cmd === "run") {}
    else if(message.cmd === "done") {}
  };

  function setupCombat() {}
})();
