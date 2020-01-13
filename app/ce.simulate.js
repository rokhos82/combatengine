(function () {
  function controller($scope,_appVersion,_log,_state,_groups) {
    $this = this;

    $this.appVersion = _appVersion;
    $this.teams = {}

    $this.$onInit = function() {
      _log.info("Entering the simulate state");
      $this.log = _log.list("main");
      _state.title = "Simulate";
      $this.teams["Red"] = _groups.list("Red");
      //$scope.$apply();
    };
  }

  controller.$inject = ["$scope","ce.app.version","ce.app.log","ce.app.state","ce.app.group"];

  angular.module("ce.app").component("ce.app.simulate",{
    templateUrl: "./app/ce.simulate.html",
    controller: controller,
    bindings: {}
  });
})();
