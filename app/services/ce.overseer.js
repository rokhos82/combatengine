(function(){
  var overseer = function(_log,_uuid) {
    var foreman = null;

    // ForemanWorker object - wraps a Web Worker in a custom interface
    var ForemanWorker = function() {
      var $this = this;

      $this.thread = new Worker('app/workers/worker.foreman.js');
      $this.uuid = _uuid.generate();

      $this.thread.postMessage({
        cmd: 'init',
        uuid: $this.uuid
      });
    };

    ForemanWorker.prototype.addListener = function(func) {
      this.thread.addEventListener('message',func)
    };

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

  overseer.$inject = ["ce.app.log","UuidService"];

  angular.module("ce.app").factory("ce.app.overseer",overseer);
})();
