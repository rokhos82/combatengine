(function(){
  var overseer = function(_log) {
    var $this = this;

    _log.info("Building the overseer object");

    var foreman = new Worker('app/workers/worker.foreman.js');

    foreman.onmessage = function(e) {
      _log.info(e.data);
    };

    var os = {};
    return os;
  };

  overseer.$inject = ["ce.app.log"];

  angular.module("ce.app").factory("ce.app.overseer",overseer);
})();
