(function() {
  var app = angular.module("ce.base").directive('ceBaseUpdateTitle',["$rootScope","$timeout",function($rootScope,$timeout) {
    return {
      restrict: 'A',
      link: function(scope,element,attrs,controller,transcludeFn) {}
    };
  }]);
})();
