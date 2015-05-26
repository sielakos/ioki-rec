'use strict';

angular.module('app', ['templates', 'app.exercises', 'app.navigation']);
angular.module('templates', []);
angular.module('app.exercises', []);
angular.module('app.navigation', []);
angular.module('app.navigation').directive('navigation', function () {
  return {
    restrict: 'E',
    templateUrl: 'navigation/navigation.html'
  };
});