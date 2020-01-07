function controller($appVersion,_log) {
  $this = this;

  $this.appVersion = $appVersion;

  $this.$onInit = function() {
    _log.info("Entering the news state");

    $this.log = _log.list("main");
  };
}

controller.$inject = ["ce.app.version","ce.app.log"];

angular.module("ce.app").component("ce.app.news",{
  templateUrl: "./app/ce.news.html",
  controller: controller,
  bindings: {}
});
