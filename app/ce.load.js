(function() {
  function controller($scope,_appVersion,_udl,_groups,_log,_state) {
    $this = this;

    $this.appVersion = _appVersion;

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
      //$scope.$apply();
    };

    $this.parseGroup = function(udlStr) {
      _log.info("Parsing group: " + udlStr);
      var group = _udl.parseGroup(udlStr);
      var team = $this.selectedTeam.label;
      _groups.add(team,group);
      $this.teams[team] = _groups.list(team);
    };
  }

  controller.$inject = ["$scope","ce.app.version","ce.app.udl","ce.app.group","ce.app.log","ce.app.state"];

  angular.module("ce.app").component("ce.app.load",{
    templateUrl: "./app/ce.load.html",
    controller: controller,
    bindings: {}
  });
})();
