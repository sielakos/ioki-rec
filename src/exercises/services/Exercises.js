/**
 * Service that keeps exercises list and current exercise position.
 * It broadcasts 'app.exercises::new-position' event on $rootScope when current position changes.
 */
angular.module('app.exercises').factory('Exercises', ($rootScope) => {
  var labelsExercise = {
    title: 'Label the weather symbols.',
    type: 'labels',
    pictures: [
      {
        img: 'images/pictures/exercise2/1.png',
        correct: 'foggy'
      },
      {
        img: 'images/pictures/exercise2/2.png',
        correct: 'raining'
      },
      {
        img: 'images/pictures/exercise2/3.png',
        correct: 'sunny'
      },
      {
        img: 'images/pictures/exercise2/4.png',
        correct: 'cloudy'
      },
      {
        img: 'images/pictures/exercise2/5.png',
        correct: 'windy'
      },
      {
        img: 'images/pictures/exercise2/6.png',
        correct: 'snowing'
      }
    ]
  };

  var whatYouSeeExercise = {
    title: 'What school activities do you see on the picture?',
    type: 'what-you-see',
    pictures: [
      {
        img: 'images/pictures/exercise1/1.png',
        text: 'doing a project',
        index: 5
      },
      {
        img: 'images/pictures/exercise1/2.png',
        text: 'enjoying a field trip',
        index: 1
      },
      {
        img: 'images/pictures/exercise1/3.png',
        text: 'working on computers',
        index: 2
      },
      {
        img: 'images/pictures/exercise1/4.png',
        text: 'taking a test',
        index: 4
      },
      {
        img: 'images/pictures/exercise1/5.png',
        text: 'giving a presentation',
        index: 3
      },
      {
        img: 'images/pictures/exercise1/6.png',
        text: 'practicing yoga',
        index: 0
      }
    ]
  };

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
      title: 'Exercise 3 Vocabulary',
      active: true,
      subs: [
        labelsExercise,
        whatYouSeeExercise
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
    getCurrentMain,
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

  function getCurrentMain() {
    return exercises[currentPosition.main];
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