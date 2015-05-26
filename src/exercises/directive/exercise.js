angular.module('app.exercises').directive('exercise', () => {
  return {
    restrict: 'E',
    templateUrl: 'exercises/exercise.html',
    controller: Exercise,
    controllerAs: 'Exercise'
  };

  function Exercise(Exercises, $rootScope) {
    this.current = Exercises.getCurrent();

    $rootScope.$on('app.exercises::new-position',
      () => this.current = Exercises.getCurrent());
  }
});