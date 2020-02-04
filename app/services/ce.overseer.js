(function(){
  var overseer = function(_log,_uuid,_objects) {
    var foreman = null;
    var _OSstate = {
      turns: {}
    };

    // ForemanWorker object - wraps a Web Worker in a custom interface
    var ForemanWorker = function() {
      var $this = this;

      $this.thread = new Worker('app/workers/worker.foreman.js');
      $this.uuid = _uuid.generate();

      $this.thread.postMessage({
        cmd: 'init',
        uuid: $this.uuid,
        commands: _objects.commands
      });
    };

    ForemanWorker.prototype.addListener = function(func) {
      this.thread.addEventListener('message',func)
    };

    ForemanWorker.prototype.postMessage = function(msg) {
      this.thread.postMessage(msg);
    };

    function overseerListener(event) {
      var msg = event.data;

      if(msg.cmd === "update") {
        _log.info(`Overseer received an update`);
        console.info(msg.update);
        _OSstate.turns[msg.update.turn] = msg.update.update;
      }
    }

    var os = {
      init: function() {
        _log.info('Initializing the overseer');
        // Create the foreman worker thread
        foreman = new ForemanWorker();

        // Create the messange handler for foreman
        foreman.addListener(function(e) {
          _log.info(e.data);
        });

        foreman.addListener(overseerListener);
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
      },
      startSimulation: function(uuid) {
        foreman.postMessage({
          cmd: "start",
          uuid: uuid
        })
      },
      getState: function(uuid) {
        return _OSstate;
      }
    };
    return os;
  };

  overseer.$inject = ["ce.app.log","UuidService","ce.app.objects"];

  angular.module("ce.app").factory("ce.app.overseer",overseer);
})();
