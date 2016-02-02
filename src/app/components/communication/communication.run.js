'use strict';

angular.module('app.communication').run(
  /* @ngInject */
  function (CommunicationUserService) {
    CommunicationUserService.initialize();
  }
);
