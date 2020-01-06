function controller($appVersion) {
  $this = this;

  $this.appVersion = $appVersion;
}

controller.$inject = ["ce.app.version"];

angular.module("ce.app").component("ce.app.group",{
  templateUrl: "./app/ce.group.html",
  controller: controller,
  bindings: {}
});
