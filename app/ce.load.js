function controller($appVersion,_udl,_groups) {
  $this = this;

  $this.appVersion = $appVersion;

  $this.parseGroup = function(udlStr) {
    _groups.add(_udl.parseGroup(udlStr));
  };
}

controller.$inject = ["ce.app.version","ce.app.udl","ce.app.group"];

angular.module("ce.app").component("ce.app.load",{
  templateUrl: "./app/ce.load.html",
  controller: controller,
  bindings: {}
});
