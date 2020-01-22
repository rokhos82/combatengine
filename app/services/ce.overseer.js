(function(){
  var overseer = function(_log) {
    var foreman = null;

    var os = {
      init: function() {
        _log.info('Initializing the overseer');
        // Create the foreman worker thread
        foreman = new Worker('app/workers/worker.foreman.js');

        // Create the messange handler for foreman
        foreman.onmessage = function(e) {
          _log.info(e.data);
        };
      },
      destroy: function() {
        // Destroy the foreman worker thread
        foreman.terminate();
      },
      setupSimulation: function(data) {
        var msg = {
          cmd: "setup",
          data: data
        };
        foreman.postMessage(msg);
      }
    };
    return os;
  };

  overseer.$inject = ["ce.app.log"];

  angular.module("ce.app").factory("ce.app.overseer",overseer);
})();
