(function () {
  /*
  ** Simulation UI controller.
  */
  function controller($scope,_appVersion,_log,_state,_groups,_uuid,_overseer) {
    $this = this;

    $this.appVersion = _appVersion;
    $this.teams = {};
    $this.armed = false;
    $this.simulations = {};
    $this.conditions = {
      title: "",
      turns: 0
    };
    $this.status = "Ready for setup! Please review the teams below and click 'Setup Combat' when ready to begin.";

    $this.$onInit = function() {
      _log.info("Entering the simulate state");
      $this.log = _log.list("main");
      _state.title = "Simulate";
      $this.teams["Red"] = _groups.list("Red");
      $this.teams["Blue"] = _groups.list("Blue");

      if (!readyCheck()) {
        $this.status = "Both teams must have at least one unit!";
      }
      //$scope.$apply();
    };

    $this.$onDestroy = function() {
    };

    function readyCheck() {
      return ($this.teams["Red"].units && $this.teams["Blue"].units);
    }

    $this.setup = function() {
      $this.armed = true;
      var uuid = _uuid.generate();
      $this.simulations[uuid] = {
        "uuid": uuid,
        "teams": $this.teams,
        "armed": true,
        "conditions": $this.conditions
      };
      _overseer.setupSimulation($this.simulations[uuid]);
      $this.uuid = uuid;
    };

    $this.start = function() {
      _log.info("Overseer is starting combat");
      _overseer.startSimulation($this.uuid);
    };
  }

  controller.$inject = ["$scope","ce.app.version","ce.app.log","ce.app.state","ce.app.group","UuidService","ce.app.overseer"];

  angular.module("ce.app").component("ce.app.simulate",{
    templateUrl: "./app/ce.simulate.html",
    controller: controller,
    bindings: {}
  });
})();
