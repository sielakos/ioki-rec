angular.module('app.exercises').directive('textExercise', () => {
  return {
    restrict: 'E',
    templateUrl: 'exercises/text-exercise.html',
    scope: {
      exercise: '='
    }
  }
});