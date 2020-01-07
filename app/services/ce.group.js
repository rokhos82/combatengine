function factory() {
  var $data = {};
  $data.groups = {
    "Red": {},
    "Blue": {}
  };

  var $fact = {};

  return $fact;
}

factory.$inject = [];

angular.module("ce.app").factory("ce.app.group",factory);
