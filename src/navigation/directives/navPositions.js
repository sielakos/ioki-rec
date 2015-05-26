/**
 * Component with navigation dots
 */
angular.module('app.navigation').directive('navPositions', () => {
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
      var positions = exercises.reduce((positions, exercise, mainIndex) => {
        positions.push({
          big: true,
          main: mainIndex,
          sub: 0,
          active: exercise.active
        });

        var subs = exercise.subs.map((sub, subIndex) => {
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
      return positions.filter((pos, posIndex) => {
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