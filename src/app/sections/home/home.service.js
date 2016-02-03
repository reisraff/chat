'use strict';

angular.module('app').service(
  'HomeService',
  /* @ngInject */
  function (CommunicationUserService) {
    this.getUser = function () {
      return CommunicationUserService.getUser();
    };
  }
);
