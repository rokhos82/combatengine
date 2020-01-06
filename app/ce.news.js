function controller($appVersion) {
  $this = this;

  $this.appVersion = $appVersion;
}

controller.$inject = ["ce.app.version"];

angular.module("ce.app").component("ce.app.news",{
  templateUrl: "./app/ce.news.html",
  controller: controller,
  bindings: {}
});
