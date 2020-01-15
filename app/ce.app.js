// Create the main module for the CombatEngine /////////////////////////////////
var app = angular.module("ce.app", ["ui.router", "ngAnimate", "ngSanitize","ce.service.uuid"]);

// Main application version ////////////////////////////////////////////////////
app.constant("ce.app.version","0.2.7");

app.config(["$stateProvider", "$compileProvider", function($stateProvider, $compileProvider) {
  var states = [{
    name: 'news',
    url: '',
    component: 'ce.app.news'
  },{
    name: 'load',
    url: '/load',
    component: 'ce.app.load'
  },{
    name: 'simulate',
    url: '/simulate',
    component: 'ce.app.simulate'
  }];

  _.forEach(states, function(state) {
    $stateProvider.state(state);
  });

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http?|ftp|mailto|tel|file|blob|data):/);
}]);

app.controller("beController", ["$scope","ce.app.version","$state","ce.app.log","ce.app.state",controller]);

function controller($scope,$appVersion,$state,_log,_state) {
  var $this = this;

  $this.appVersion = $appVersion;
  $this.state = _state;

  $this.fleets = {};
  $this.teams = {
    "Blue": {
      name: "Blue",
      fleets: {}
    },
    "Red": {
      name: "Red",
      fleets: {}
    }
  };
  $this.teamOptions = [
    {
      label: "Blue",
      value: 1
    },
    {
      label: "Red",
      value: 2
    }
  ];
  $this.selectedTeam = $this.teamOptions[0];

  $this.udl = `[fleet name "Blue One"]
[unit name "Beam Frigate B1" size 3 type starship [armor max 9 current 9][shield max 1 current 1][battery volley 4 target 15][battery volley 4 target 15][stl defense 15][ftl cruise 5 max 6][sensor 2 lrs]]
[unit name "Beam Frigate B2" size 3 type starship [armor max 9 current 9][shield max 1 current 1][battery volley 4 target 15][battery volley 4 target 15][stl defense 15][ftl cruise 5 max 6][sensor 2 lrs]]`;

  var components = {
    armor: {
      regex: /\[armor(.*?)\]/g,
      label: "armor"
    },
    shield: {
      regex: /\[shield(.*?)\]/g,
      label: "shield"
    },
    battery: {
      regex: /\[battery(.*?)\]/g,
      label: "battery"
    },
    launcher: {
      regex: /\[launcher(.*?)\]/g,
      label: "launcher"
    },
    ecm: {
      regex: /\[ecm(.*?)\]/g,
      label: "ecm"
    },
    bc: {
      regex: /\[bc(.*?)\]/g,
      label: "ecm"
    },
    cic: {
      regex: /\[cic(.*?)\]/g,
      label: "cic"
    },
    stl: {
      regex: /\[stl(.*?)\]/g,
      label: "stl"
    },
    ftl: {
      regex: /\[ftl(.*?)\]/g,
      label: "ftl"
    }
  };

  var tags = {
    defense: /(?:defense )(?<defense>\d+)/,
    deflect: /(?:deflect )(?<deflect>\d+)/,
    regen: /(?:regen )(?<regen>\d+)/,
    size: /(?:size )(?<size>\d+)/,
    target: /(?:target )(?<target>\d+)/
  };

  var regex = {
    unit: {
      test: /\[unit.*\]/g,
      decode: /(?:unit\s+name\s+[\"|\'])(?<name>.+?)(?:[\"|\']\s+size\s+)(?<size>\d+)(?:\s+type\s+)(?<type>.+?)(?:[\s|\[])/
    },
    fleet: {
      name: /(?:name\s+[\"|\'])(?<name>.+?)(?:[\"|\'])/
    },
    armor: {
      scrape: /\[(?<armor>armor.*?)\]/,
      hp: /(?:armor )(?<hp>\d+)/,
      deflect: tags.deflect,
      regen: tags.regen,
      defense: tags.defense
    },
    shield: {
      scrape: /\[(?<shield>shield.*?)\]/,
      max: /(?:max )(?<max>\d+)/,
      current: /(?:current )(?<current>\d+)/,
      deflect: tags.deflect,
      regen: tags.regen,
      defense: tags.defense
    },
    battery: {
      test: /\[battery.+?\]/g,
      scrape: /\[(?<battery>battery.+?)\]/,
      volley: /(?:volley )(?<volley>\d+)/,
      size: tags.size,
      target: tags.target
    },
    launcher: {
      quantity: /(?:launcher )(?<quantity>\d+)/,
      target: tags.target,
      size: tags.size
    },
    stl: {
      test: /\[stl.+?\]/g,
      scrape: /\[(?<stl>stl.+?)\]/
    },
    ftl: {
      test: /\[ftl.+?\]/g,
      scrape: /\[(?<ftl>ftl.+?)\]/
    }
  };

  $this.$onInit = function() {
    _log.info("Entering main app controller");
    $state.go('news');
  };

  $this.loadPresets = function() {
    var blueOne = `[fleet name "Blue One"]
[unit name "Beam Frigate B1" size 3 type starship [armor max 9 current 9][shield max 1 current 1][battery volley 4 target 15][battery volley 4 target 15][stl defense 15][ftl cruise 5 max 6][sensor 2 lrs]]
[unit name "Beam Frigate B2" size 3 type starship [armor max 9 current 9][shield max 1 current 1][battery volley 4 target 15][battery volley 4 target 15][stl defense 15][ftl cruise 5 max 6][sensor 2 lrs]]`;
    var redTwo = `[fleet name "Red Two"]
[unit name "Beam Frigate B1" size 3 type starship [armor max 9 current 9][shield max 1 current 1][battery volley 4 target 15][battery volley 4 target 15][stl defense 15][ftl cruise 5 max 6][sensor 2 lrs]]
[unit name "Beam Frigate B2" size 3 type starship [armor max 9 current 9][shield max 1 current 1][battery volley 4 target 15][battery volley 4 target 15][stl defense 15][ftl cruise 5 max 6][sensor 2 lrs]]`;

    // Add the Blue One fleet to the Blue team
    $this.selectedTeam = $this.teamOptions[0];
    $this.parseFleet(blueOne);

    // Add the Red Two fleet to the Red team
    $this.selectedTeam = $this.teamOptions[1];
    $this.parseFleet(redTwo);

    // Clear the input form controls
    $this.selectedTeam = undefined;
    $this.udl = "";
  };

  $this.parseFleet = function(str) {
    var fleetReg = /\[(?<fleet>fleet.+)\]/;
    var fleetStr = str.match(fleetReg).groups.fleet;
    var name = fleetStr.match(regex.fleet.name).groups.name;
    var fleet = {};
    fleet.udl = fleetStr;
    fleet.name = name;

    var unitReg = /\[unit.*\]/g;
    var unitStr = unitReg.exec(str);
    fleet.units = {};
    do {
      var u = $this.parseUnit(unitStr[0]);
      fleet.units[u.name] = u;
      unitStr = unitReg.exec(str);
    } while (unitStr !== null)

    //$this.fleets[name] = fleet;
    $this.teams[$this.selectedTeam.label].fleets[name] = fleet;
  };

  $this.parseUnit = function(str) {
    var unit = {};

    if (regex.unit.test.test(str)) {
      // The string is a unit string
      var info = str.match(regex.unit.decode);
      unit.name = info.groups.name;
      unit.size = parseInt(info.groups.size);
      unit.type = info.groups.type;

      var armor = str.match(regex.armor.scrape).groups.armor;
      unit.armor = {};
      unit.armor.max = armor.match(/(?:max )(?<max>\d+)/).groups.max;
      unit.armor.current = armor.match(/(?:current )(?<current>\d+)/).groups.current;

      var shield = str.match(regex.shield.scrape).groups.shield;
      unit.shield = {};
      unit.shield.max = shield.match(regex.shield.max).groups.max;
      unit.shield.current = shield.match(regex.shield.current).groups.current;

      unit.batteries = $this.parseBatteries(str);

      unit.launchers = $this.parseLaunchers(str);

      var stl = str.match(regex.stl.scrape).groups.stl;
      unit.stl = {
        udl: stl
      };

      var ftl = str.match(regex.ftl.scrape).groups.ftl;
      unit.ftl = {
        udl: ftl
      };
    }

    // Reset the regular expressions
    $this.regexReset();
    return unit;
  };

  $this.parseBatteries = function(unitStr) {
    var batteries = [];

    var battStr = regex.battery.test.exec(unitStr);
    var limit = 10;
    var count = 0;
    while(battStr !== null && count < limit) {
      var batt = {};

      battStr = battStr[0];
      batt.udl = battStr;
      batteries.push(batt);

      batt.volley = parseInt(battStr.match(regex.battery.volley).groups.volley);
      batt.target = parseInt(battStr.match(regex.battery.target).groups.target);

      battStr = regex.battery.test.exec(unitStr);
      count++;
    }

    regex.battery.test.lastIndex = 0;

    return batteries;
  };

  $this.parseLaunchers = function(unitStr) {
    var launchers = [];

    return launchers;
  };

  $this.regexReset = function() {
    _.forEach(regex,function(o) {
      _.forEach(o,function(r) {
        r.lastIndex = 0;
      });
    });
  };

  $this.log = [];
  var combatLogEntry = function(turn,teams) {
    this.turn = turn;
    this.teams = _.cloneDeep(teams);
    this.log = [];
  };

  combatLogEntry.prototype.addTextLog = function(text) {
    this.log.push(text);
  };

  combatLogEntry.prototype.getTextLog = function() {
    return this.log;
  };

  combatNarrativeLog = function() {
    this.log = [];
  };

  combatNarrativeLog.prototype.add = function(text) {
    this.log.push(text);
  };

  combatNarrativeLog.prototype.get = function() {
    return this.log;
  };

  $this.fire = function(teams) {
    // This function starts the combat simulation
    var log = new combatNarrativeLog();
    log.add("Beginning Combat");
    _.forEach(teams,function(team) {
      log.add("Team " + team.name);
    });
    log.add("Begin Turn 1");
    $this.doCombatTurn(log,teams);
    $this.log = log.get();
  };

  $this.doCombatTurn = function(log,teams) {
    log.add("Determining Combatants");
    log.add("Selecting Targets");
    log.add("Firing Weapons");
    log.add("Resolving Damage & Effects");
  };

  $this.parseUdl = function(udl) {
    //udl = _.replace(udl,/"/g,'');

    var unitInfo = /\[unit(.*?)\]/g;
    var armorInfo = /\[armor(.*?)\]/g;
    var shieldInfo = /\[shield(.*?)\]/g;
    var batteryInfo = /\[battery(.*?)\]/g;
    var launcherInfo = /\[launcher(.*?)\]/g;

    var components = {
      unit: {
        regex: /\[unit(.*?)\]/g,
        label: "unit"
      },
      armor: {
        regex: /\[armor(.*?)\]/g,
        label: "armor"
      },
      shield: {
        regex: /\[shield(.*?)\]/g,
        label: "shield"
      },
      battery: {
        regex: /\[battery(.*?)\]/g,
        label: "battery"
      },
      launcher: {
        regex: /\[launcher(.*?)\]/g,
        label: "launcher"
      },
      ecm: {
        regex: /\[ecm(.*?)\]/g,
        label: "ecm"
      },
      bc: {
        regex: /\[bc(.*?)\]/g,
        label: "ecm"
      },
      cic: {
        regex: /\[cic(.*?)\]/g,
        label: "cic"
      },
      stl: {
        regex: /\[stl(.*?)\]/g,
        label: "stl"
      },
      ftl: {
        regex: /\[ftl(.*?)\]/g,
        label: "ftl"
      }
    };

    var tags = {
      defense: /(?:defense )(?<defense>\d+)/,
      deflect: /(?:deflect )(?<deflect>\d+)/,
      regen: /(?:regen )(?<regen>\d+)/,
      size: /(?:size )(?<size>\d+)/,
      target: /(?:target )(?<target>\d+)/
    };

    var regex = {
      unit: {
        name: /(?:name )(?:\"|\')(?<name>.+?)(?:\"|\')/,
        size: tags.size,
        type: /(?:type )(?<type>.+?) /,
        ecm: /(?:ecm )(?<ecm>\d+)/,
        bc: /(?:bc )(?<bc>\d+)/
      },
      armor: {
        hp: /(?:armor )(?<hp>\d+)/,
        deflect: tags.deflect,
        regen: tags.regen,
        defense: tags.defense
      },
      shield: {
        hp: /(?:shield )(?<hp>\d+)/,
        deflect: tags.deflect,
        regen: tags.regen,
        defense: tags.defense
      },
      battery: {
        volley: /(?:battery )(?<volley>\d+)/,
        size: tags.size,
        target: tags.target
      },
      launcher: {
        quantity: /(?:launcher )(?<quantity>\d+)/,
        target: tags.target,
        size: tags.size
      }
    };

    _.forEach(components, function(comp) {
      if (comp.regex.test(udl)) {
        matches = udl.match(comp.regex);
        $this.unit[comp.label] = {
          udl: matches,
          info: []
        };
        _.forEach(matches, function(sub, index) {
          $this.unit[comp.label].info[index] = {};
          _.forEach(regex[comp.label], function(regex, label) {
            if (regex.test(sub)) {
              $this.unit[comp.label].info[index][label] = sub.match(regex)[1];
            }
          });
        });
      }
    });
  };
}
