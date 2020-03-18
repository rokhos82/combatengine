(function (){
  function controller($scope,_appVersion,_log,_state) {
    $this = this;

    $this.appVersion = _appVersion;

    $this.$onInit = function() {
      _log.info("Entering the news state");
      $this.log = _log.list("main");
      _state.title = "Home";
      //$scope.$apply();
    };
  }

  controller.$inject = ["$scope","ce.app.version","ce.app.log","ce.app.state"];

  angular.module("ce.app").component("ce.app.news",{
    templateUrl: "./app/ce.news.html",
    controller: controller,
    bindings: {}
  });
})();
