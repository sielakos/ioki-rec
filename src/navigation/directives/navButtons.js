/**
 * Component with next and back buttons.
 */
angular.module('app.navigation').directive('navButtons', () => {
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
      return nextAction(() => true, () => false);
    }

    function next() {
      nextAction((main, sub) => Exercises.setPosition(main, sub));
    }

    function hasPrev() {
      return prevAction(() => true, () => false);
    }

    function prev() {
      prevAction((main, sub) => Exercises.setPosition(main, sub));
    }

    //if exercises have next runs success function
    //otherwise runs fail function
    function nextAction(success, fail) {
      var exercises = Exercises.getExercises();
      var {main, sub} = Exercises.getCurrentPosition();
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
      var {main, sub} = Exercises.getCurrentPosition();
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