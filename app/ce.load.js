(function() {
  function controller($scope,_appVersion,_groups,_log,_state) {
    $this = this;

    $this.appVersion = _appVersion;

    //$this.example = angular.fromJson(`{"name":"Test","units": {"Test Unit": {"name": "Test Unit","size": 1,"type": "test"}}}`);
    $this.example = `{"name":"Test","units": {"Test Unit": {"name": "Test Unit","size": 1,"type": "test"}}}`;
    //$this.blueExample = `{"name":"Blue Two","units": [{"name": "Blue Two 1","size": 1,"type": "test"},{"name": "Blue Two 2","size": 1,"type": "test"}]}`;
    $this.redExample = `{"name":"Red One","units": [{"name": "Red One 1","size": 6,"type": "starship","components": [{"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},{"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},{"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "stl","crit": "engine","effects": {"defense": 150}},{"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},{"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}]}]}`;
    $this.blueExample = `{"name":"Blue Two","units":[{"name": "Blue Two 1","size": 6,"type": "starship","components": [{"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},{"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},{"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "stl","crit": "engine","effects": {"defense": 150}},{"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},{"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}]}]}`;

    $this.teams = {};
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

    $this.$onInit = function() {
      _log.info("Entering the load state");
      $this.log = _log.list("main");
      _state.title = "Load Groups";
      $this.teams["Red"] = _groups.list("Red");
      $this.teams["Blue"] = _groups.list("Blue");
      //$scope.$apply();
    };

    $this.parseGroup = function(udlStr) {
      var group = angular.fromJson(udlStr);
      //_log.info("Parsing group: " + udlStr);
      //var group = _udl.parseGroup(udlStr);
      var team = $this.selectedTeam.label;
      _groups.add(team,group);
      $this.teams[team] = _groups.list(team);
    };
  }

  controller.$inject = ["$scope","ce.app.version","ce.app.group","ce.app.log","ce.app.state"];

  angular.module("ce.app").component("ce.app.load",{
    templateUrl: "./app/ce.load.html",
    controller: controller,
    bindings: {}
  });
})();
