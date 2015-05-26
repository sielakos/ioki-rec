angular.module('app.exercises').directive('whatYouSee', () => {
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
    this.isCorrect = (picture) => picture.answer - 1 === picture.index;
  }
});