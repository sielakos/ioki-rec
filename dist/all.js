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
    this.currentMain = Exercises.getCurrentMain();
    this.check = false;
    this.switchCheck = function () {
      _this.check = !_this.check;
    };

    this.switchImg = function () {
      if (_this.check) {
        return 'images/icons/refresh_white.png';
      } else {
        return 'images/icons/tick_white.png';
      }
    };

    $rootScope.$on('app.exercises::new-position', function () {
      _this.current = Exercises.getCurrent();
      _this.currentMain = Exercises.getCurrentMain();
      _this.check = false;
    });
  }
});
angular.module('app.exercises').directive('labelsExercise', function () {
  LabelsExercise.$inject = ["$scope"];
  return {
    restrict: 'E',
    templateUrl: 'exercises/labels.html',
    controller: LabelsExercise,
    controllerAs: 'LabelsExercise',
    scope: {
      exercise: '=',
      check: '='
    }
  };

  function LabelsExercise($scope) {
    $scope.$watch('exercise', function () {
      return $scope.exercise.words = $scope.exercise.pictures.map(function (picture) {
        return picture.correct;
      });
    });

    this.isCorrect = function (picture) {
      return uniform(picture.answer) === uniform(picture.correct);
    };

    function uniform(str) {
      return str.replace(/ /g, ' ').trim().toLowerCase();
    }
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
angular.module('app.exercises').directive('whatYouSee', function () {
  return {
    templateUrl: 'exercises/what-you-see.html',
    scope: {
      exercise: '=',
      check: '='
    },
    controller: WhatYouSee,
    controllerAs: 'WhatYouSee'
  };

  function WhatYouSee() {
    this.isCorrect = function (picture) {
      return picture.answer - 1 === picture.index;
    };
  }
});
/**
 * Service that keeps exercises list and current exercise position.
 * It broadcasts 'app.exercises::new-position' event on $rootScope when current position changes.
 */
angular.module('app.exercises').factory('Exercises', ["$rootScope", function ($rootScope) {
  var labelsExercise = {
    title: 'Label the weather symbols.',
    type: 'labels',
    pictures: [{
      img: 'images/pictures/exercise2/1.png',
      correct: 'foggy'
    }, {
      img: 'images/pictures/exercise2/2.png',
      correct: 'raining'
    }, {
      img: 'images/pictures/exercise2/3.png',
      correct: 'sunny'
    }, {
      img: 'images/pictures/exercise2/4.png',
      correct: 'cloudy'
    }, {
      img: 'images/pictures/exercise2/5.png',
      correct: 'windy'
    }, {
      img: 'images/pictures/exercise2/6.png',
      correct: 'snowing'
    }]
  };

  var whatYouSeeExercise = {
    title: 'What school activities do you see on the picture?',
    type: 'what-you-see',
    pictures: [{
      img: 'images/pictures/exercise1/1.png',
      text: 'doing a project',
      index: 5
    }, {
      img: 'images/pictures/exercise1/2.png',
      text: 'enjoying a field trip',
      index: 1
    }, {
      img: 'images/pictures/exercise1/3.png',
      text: 'working on computers',
      index: 2
    }, {
      img: 'images/pictures/exercise1/4.png',
      text: 'taking a test',
      index: 4
    }, {
      img: 'images/pictures/exercise1/5.png',
      text: 'giving a presentation',
      index: 3
    }, {
      img: 'images/pictures/exercise1/6.png',
      text: 'practicing yoga',
      index: 0
    }]
  };

  var exercises = [{
    active: false,
    subs: [{ type: 'text', text: 'sub1 mock' }, { type: 'text', text: 'sub2 mock' }, { type: 'text', text: 'sub3 mock' }, { type: 'text', text: 'sub4 mock' }, { type: 'text', text: 'sub5 mock' }, { type: 'text', text: 'sub6 mock' }, { type: 'text', text: 'sub7 mock' }]
  }, {
    active: false,
    subs: [{ type: 'text', text: 'sub1 mock' }, { type: 'text', text: 'sub2 mock' }, { type: 'text', text: 'sub3 mock' }]
  }, {
    title: 'Exercise 3 Vocabulary',
    active: true,
    subs: [labelsExercise, whatYouSeeExercise]
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
    getCurrentMain: getCurrentMain,
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

  function getCurrentMain() {
    return exercises[currentPosition.main];
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