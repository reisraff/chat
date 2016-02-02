'use strict';

angular.module('app').service(
  'HomeService',
  /* @ngInject */
  function (CommunicationAdministratorService) {
    this.getAdministrator = function () {
      return CommunicationAdministratorService.getAdministrator();
    };
  }
);
