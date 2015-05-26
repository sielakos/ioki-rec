'use strict';

angular.module('app', ['templates', 'app.exercises', 'app.navigation']);
angular.module('templates', []);
angular.module('app.exercises', []);
angular.module('app.navigation', []);
angular.module('app.exercises').directive('exercise', function () {
  Exercise.$inject = ["Exercises", "$rootScope"];
  return {
    restrict: 'E',
    templateUrl: 'exercises/exercise.html',
    controller: Exercise,
    controllerAs: 'Exercise'
  };

  function Exercise(Exercises, $rootScope) {
    var _this = this;

    this.current = Exercises.getCurrent();

    $rootScope.$on('app.exercises::new-position', function () {
      return _this.current = Exercises.getCurrent();
    });
  }
});
angular.module('app.exercises').directive('textExercise', function () {
  return {
    restrict: 'E',
    templateUrl: 'exercises/text-exercise.html',
    scope: {
      exercise: '='
    }
  };
});
/**
 * Service that keeps exercises list and current exercise position.
 * It broadcasts 'app.exercises::new-position' event on $rootScope when current position changes.
 */
angular.module('app.exercises').factory('Exercises', ["$rootScope", function ($rootScope) {
  var exercises = [{
    active: false,
    subs: [{ type: 'text', text: 'sub1 mock' }, { type: 'text', text: 'sub2 mock' }, { type: 'text', text: 'sub3 mock' }, { type: 'text', text: 'sub4 mock' }, { type: 'text', text: 'sub5 mock' }, { type: 'text', text: 'sub6 mock' }, { type: 'text', text: 'sub7 mock' }]
  }, {
    active: false,
    subs: [{ type: 'text', text: 'sub1 mock' }, { type: 'text', text: 'sub2 mock' }, { type: 'text', text: 'sub3 mock' }]
  }, {
    active: true,
    subs: [{ type: 'text', text: 'sub1 mock' }, { type: 'text', text: 'sub2 mock' }]
  }, {
    active: false,
    subs: [{ type: 'text', text: 'sub1 mock' }, { type: 'text', text: 'sub2 mock' }, { type: 'text', text: 'sub3 mock' }]
  }, {
    active: false,
    subs: [{ type: 'text', text: 'sub1 mock' }, { type: 'text', text: 'sub2 mock' }, { type: 'text', text: 'sub3 mock' }]
  }];

  var currentPosition = { main: 2, sub: 0 };

  return {
    getExercises: getExercises,
    getCurrent: getCurrent,
    setPosition: setPosition,
    getCurrentPosition: getCurrentPosition
  };

  function getExercises() {
    return exercises;
  }

  function getCurrent() {
    var main = currentPosition.main;
    var sub = currentPosition.sub;

    if (exercises[main] && exercises[main].subs[sub]) {
      return exercises[main].subs[sub];
    }
  }

  function setPosition(main, sub) {
    if (exercises[main]) {
      exercises.forEach(function (main) {
        return main.active = false;
      });

      exercises[main].active = true;
      currentPosition = { main: main, sub: sub };
      $rootScope.$broadcast('app.exercises::new-position');
    }
  }

  function getCurrentPosition() {
    return angular.extend({}, currentPosition);
  }
}]);
/**
 * Component with next and back buttons.
 */
angular.module('app.navigation').directive('navButtons', function () {
  NavButtons.$inject = ["Exercises"];
  return {
    restrict: 'E',
    templateUrl: 'navigation/nav-buttons.html',
    controller: NavButtons,
    controllerAs: 'NavButtons'
  };

  function NavButtons(Exercises) {
    this.hasNext = hasNext;
    this.next = next;
    this.hasPrev = hasPrev;
    this.prev = prev;

    function hasNext() {
      return nextAction(function () {
        return true;
      }, function () {
        return false;
      });
    }

    function next() {
      nextAction(function (main, sub) {
        return Exercises.setPosition(main, sub);
      });
    }

    function hasPrev() {
      return prevAction(function () {
        return true;
      }, function () {
        return false;
      });
    }

    function prev() {
      prevAction(function (main, sub) {
        return Exercises.setPosition(main, sub);
      });
    }

    //if exercises have next runs success function
    //otherwise runs fail function
    function nextAction(success, fail) {
      var exercises = Exercises.getExercises();

      var _Exercises$getCurrentPosition = Exercises.getCurrentPosition();

      var main = _Exercises$getCurrentPosition.main;
      var sub = _Exercises$getCurrentPosition.sub;

      if (exercises[main].subs.length > sub + 1) {
        return success(main, sub + 1);
      }

      if (exercises.length > main + 1 && exercises[main + 1].subs.length > 0) {
        return success(main + 1, 0);
      }

      return fail();
    }

    //Same as above for previous
    function prevAction(success, fail) {
      var exercises = Exercises.getExercises();

      var _Exercises$getCurrentPosition2 = Exercises.getCurrentPosition();

      var main = _Exercises$getCurrentPosition2.main;
      var sub = _Exercises$getCurrentPosition2.sub;

      if (0 <= sub - 1) {
        return success(main, sub - 1);
      }

      if (main - 1 >= 0 && exercises[main - 1].subs.length > 0) {
        return success(main - 1, exercises[main - 1].subs.length - 1);
      }

      return fail();
    }
  }
});
/**
 * Component with navigation dots
 */
angular.module('app.navigation').directive('navPositions', function () {
  NavPositions.$inject = ["Exercises", "$rootScope"];
  return {
    restrict: 'E',
    templateUrl: 'navigation/nav-positions.html',
    controller: NavPositions,
    controllerAs: 'NavPositions'
  };

  function NavPositions(Exercises, $rootScope) {
    update = update.bind(this);

    this.positions = [];
    this.currentPosition = null;
    this.isCurrentPosition = isCurrentPosition;
    this.changePosition = changePosition;

    update();

    $rootScope.$on('app.exercises::new-position', update);

    function update() {
      this.positions = getPositions();
      this.currentPosition = Exercises.getCurrentPosition();
    }

    function changePosition(position) {
      Exercises.setPosition(position.main, position.sub);
    }

    function isCurrentPosition(position) {
      var currentPos = Exercises.getCurrentPosition();
      return currentPos.main === position.main && currentPos.sub === position.sub && !position.big;
    }

    //Returns positions to be displayed.
    //Filtration algorithm could be improved, but will do for now.
    function getPositions() {
      var exercises = Exercises.getExercises();
      //Creates all positions from exercises
      var positions = exercises.reduce(function (positions, exercise, mainIndex) {
        positions.push({
          big: true,
          main: mainIndex,
          sub: 0,
          active: exercise.active
        });

        var subs = exercise.subs.map(function (sub, subIndex) {
          return {
            big: false,
            main: mainIndex,
            sub: subIndex,
            active: exercise.active
          };
        });

        return positions.concat(subs);
      }, []);

      var currentIndex = indexOfPosition(Exercises.getCurrentPosition());

      //Keeps only positions close to current position
      return positions.filter(function (pos, posIndex) {
        var diff = posIndex - currentIndex;
        return diff <= 5 && diff >= -4;
      });

      function indexOfPosition(targetPos) {
        var i;
        var position;

        for (i = 0; i < positions.length; i++) {
          position = positions[i];
          if (position.sub === targetPos.sub && position.main === targetPos.main) {
            return i;
          }
        }

        return -1;
      }
    }
  }
});
angular.module('app.navigation').directive('navigation', function () {
  return {
    restrict: 'E',
    templateUrl: 'navigation/navigation.html'
  };
});