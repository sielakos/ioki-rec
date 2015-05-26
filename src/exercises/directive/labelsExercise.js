angular.module('app.exercises').directive('labelsExercise', () => {
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
    $scope.$watch('exercise', () =>
      $scope.exercise.words = $scope.exercise.pictures.map(picture => picture.correct));

    this.isCorrect = picture => picture.answer === picture.correct;
  }
});