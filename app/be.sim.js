function controller() {
  var _battleGround = [];
  var _area = {
    units: {}
  };

  var _setup = function(fleets) {
    // Get the largest wave # from all units in all fleets...this could take a while
    var maxWave = 1;

    // Setup the indexes into the fleets and units

    // Set the battleground
    _battleGround.length = (maxWave * 2) + 1;
    _.fill(_battleGround,_area);

    // Populate the battleground using _.pull?
    // Could also use _.groupBy with unit wave number specified?
  };

  var _factory = {
    setup: _setup
  };

  return _factory;
}

controller.$inject = [];

angular.module("be.app").factory("be.sim.main",controller);
