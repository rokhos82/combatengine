function factory(_objects) {
  var $data = {
  };

  var _internal = {};
  _internal.getLog = function(log) {
    // If the log array doesn't exist create it.
    if(!_.isArray($data[log])) {
      $data[log] = [];
    }
    // Return the specified array
    return $data[log];
  };

  var $fact = {};

  $fact.new = function(log,level,msg) {
    var e = _.cloneDeep(_objects.log);
    e.level = level;
    e.msg = msg;
    _internal.getLog(log).unshift(e);
  };

  $fact.list = function(log,level) {
    return _internal.getLog(log);
  };

  $fact.info = function(msg) {
    $fact.new("main","info",msg);
    console.info(msg);
  };

  return $fact;
}

factory.$inject = ["ce.app.objects"];

angular.module("ce.app").factory("ce.app.log",factory);
