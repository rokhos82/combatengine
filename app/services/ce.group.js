function factory() {
  var $data = {};
  $data.groups = {
    "red": {},
    "blue": {}
  };

  var $fact = {};

  $fact.add = function(team,group) {
    team = _.toLower(team);
    $data.groups[team] = group;
  };

  $fact.list = function(team) {
    team = _.toLower(team);
    return $data.groups[team];
  };

  return $fact;
}

factory.$inject = [];

angular.module("ce.app").factory("ce.app.group",factory);
