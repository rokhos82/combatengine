(function () {
  function controller($scope,_appVersion,_log,_state) {
    $this = this;

    $this.appVersion = _appVersion;

    $this.$onInit = function() {
      _log.info("Entering the simulate state");
      $this.log = _log.list("main");
      _state.title = "Simulate";
      //$scope.$apply();
    };
  }

  controller.$inject = ["$scope","ce.app.version","ce.app.log","ce.app.state"];

  angular.module("ce.app").component("ce.app.simulate",{
    templateUrl: "./app/ce.simulate.html",
    controller: controller,
    bindings: {}
  });
})();
