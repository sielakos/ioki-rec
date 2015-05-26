angular.module('app.exercises').directive('exercise', () => {
  return {
    restrict: 'E',
    templateUrl: 'exercises/exercise.html',
    controller: Exercise,
    controllerAs: 'Exercise'
  };

  function Exercise(Exercises, $rootScope) {
    this.current = Exercises.getCurrent();
    this.check = false;
    this.switchCheck = () => {
      this.check = !this.check;
    };

    this.switchImg = () => {
      if (this.check) {
        return 'images/icons/refresh_white.png';
      } else {
        return 'images/icons/tick_white.png';
      }
    };

    $rootScope.$on('app.exercises::new-position',
      () => this.current = Exercises.getCurrent());
  }
});