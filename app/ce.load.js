function controller($appVersion) {
  $this = this;

  $this.appVersion = $appVersion;
}

controller.$inject = ["ce.app.version"];

angular.module("ce.app").component("ce.app.load",{
  templateUrl: "./app/ce.load.html",
  controller: controller,
  bindings: {}
});
