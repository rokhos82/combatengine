(function () {
  /*
  ** Main Simulation Worker
  */

  console.info("Creating simulation worker")

  // Import utility scripts
  importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.js");

  var settings = {};

  // Battlefield Object
  var Battlefield = function() {
    var $this = this;

    $this.regions = [];
  };

  // Combat Object
  var Combat = function() {
    var $this = this;

    $this.battlefield = new Battlefield();
  };

  // PoolWorker Object
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
    else if(message.cmd === "start") {
      console.info(`Starting combat for ${settings.uuid}`);
      startCombat();
    }
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

    // Setup unit attacks
    _.forEach(unitList,function(unit) {
      // Get the attacks from the unit components.
      var attacks = _.filter(unit.components,'attack');
      console.info(attacks);
      unit.attacks = attacks;
    });

    // Let the ForemanWorker know that setup is finished
    postMessage({
      cmd: "ready",
      uuid: settings.uuid
    });
  }

  function startCombat() {
    // Main combat loop
    var combatDone = false;
    var turnCount = 0;

    while(!combatDone && turnCount < settings.conditions.turns) {
      // Get the participants
      var participants = settings.unitsAll;

      // For each unit do things
      _.forEach(participants,function(unit) {
        unitTurnActions(unit);
      });

      // Last thing to do is increment the turn count
      turnCount += 1;
      console.info(`Turn Count: ${turnCount}`);
    }
  }

  function unitTurnActions(unit) {
    // Get a target figured out
    var team = unit.team;
    var target = settings.unitsAll[_.sample(settings.targets[team])];
    console.log(`${unit.name} is targetting ${target.name}`);

    // Do the attack thing
  }
})();
