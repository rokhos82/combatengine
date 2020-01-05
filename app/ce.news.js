function controller() {
  $this = this;

  $this.greeting = "Hello!";
}

angular.module("ce.app").component("ce.app.news",{
  templateUrl: "./app/ce.news.html",
  controller: controller,
  bindings: {}
});
