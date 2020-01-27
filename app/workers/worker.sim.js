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
    else if(message.cmd === "setup") {
      // Get the conditions and the teams
      console.info(message.conditions);
      settings.conditions = message.conditions;
      console.info(message.teams);
      settings.teams = message.teams;
      setupCombat();
    }
    else if(message.cmd === "ready") {}
    else if(message.cmd === "start") {}
    else if(message.cmd === "run") {}
    else if(message.cmd === "done") {}
  };

  function setupCombat() {
    // Get static lists et cetera setup for the combat

    // Build a hash from the teams unit array for easier lookup
    // and add the team key to each unit too.

    var masterUnits = {};
    var unitList = [];

    // Do the Red team first
    var redUnits = {};
    var blueTargets = [];
    _.forEach(settings.teams["Red"].units,function(value){
      var name = value.name;
      value.team = "Red";
      redUnits[name] = value;
      blueTargets.push(name);
      masterUnits[name] = value;
      unitList.push(name);
    });

    // Then the Blue teams
    var blueUnits = {};
    var redTargets = [];
    _.forEach(settings.teams["Blue"].units,function(value){
      var name = value.name;
      value.team = "Blue";
      blueUnits[name] = value;
      redTargets.push(name);
      masterUnits[name] = value;
      unitList.push(name);
    });

    // Save the target lists
    settings.targets = {
      "Red": redTargets,
      "Blue": blueTargets
    };

    settings.unitsAll = masterUnits;
    settings.units = {
      "Red": redUnits,
      "Blue": blueUnits
    };

    settings.unitsList = unitList;

    console.info(settings);

    // Let the ForemanWorker know that setup is finished
    postMessage({
      cmd: "ready",
      uuid: settings.uuid
    });
  }
})();
