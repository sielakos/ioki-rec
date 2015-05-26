/**
 * Service that keeps exercises list and current exercise position.
 * It broadcasts 'app.exercises::new-position' event on $rootScope when current position changes.
 */
angular.module('app.exercises').factory('Exercises', ($rootScope) => {
  var exercises = [
    {
      active: false,
      subs: [
        {type: 'text', text: 'sub1 mock'},
        {type: 'text', text: 'sub2 mock'},
        {type: 'text', text: 'sub3 mock'},
        {type: 'text', text: 'sub4 mock'},
        {type: 'text', text: 'sub5 mock'},
        {type: 'text', text: 'sub6 mock'},
        {type: 'text', text: 'sub7 mock'}
      ]
    },
    {
      active: false,
      subs: [
        {type: 'text', text: 'sub1 mock'},
        {type: 'text', text: 'sub2 mock'},
        {type: 'text', text: 'sub3 mock'}
      ]
    },
    {
      active: true,
      subs: [
        {type: 'text', text: 'sub1 mock'},
        {type: 'text', text: 'sub2 mock'}
      ]
    },
    {
      active: false,
      subs: [
        {type: 'text', text: 'sub1 mock'},
        {type: 'text', text: 'sub2 mock'},
        {type: 'text', text: 'sub3 mock'}
      ]
    },
    {
      active: false,
      subs: [
        {type: 'text', text: 'sub1 mock'},
        {type: 'text', text: 'sub2 mock'},
        {type: 'text', text: 'sub3 mock'}
      ]
    }
  ];

  var currentPosition = {main: 2, sub: 0};

  return {
    getExercises,
    getCurrent,
    setPosition,
    getCurrentPosition
  };

  function getExercises() {
    return exercises;
  }

  function getCurrent() {
    var {main, sub} = currentPosition;
    if (exercises[main] && exercises[main].subs[sub]) {
      return exercises[main].subs[sub];
    }
  }

  function setPosition(main, sub) {
    if (exercises[main]) {
      exercises.forEach((main) => main.active = false);

      exercises[main].active = true;
      currentPosition = {main, sub};
      $rootScope.$broadcast('app.exercises::new-position');
    }
  }

  function getCurrentPosition() {
    return angular.extend({}, currentPosition);
  }
});