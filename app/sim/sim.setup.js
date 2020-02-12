//
// This is the component for setting up new combat simulations
//
(function() {
  //
  //
  //
  function controller(_uuid) {
    var $this = this;

    $this.settings = {};

    $this.ui = {
      turns: false,
      domination: false
    };


    $this.$onInit = function() {
      $this.settings.uuid = _uuid.generate();
    };
  }

  controller.$inject = ["UuidService"];

  angular.module("ce.app").component("ce.app.simulate.setup",{
    templateUrl: "./app/sim/sim.setup.html",
    controller: controller,
    bindings: {}
  });
})();
