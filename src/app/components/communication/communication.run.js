'use strict';

angular.module('app.communication').run(
  /* @ngInject */
  function (
    CommunicationUserService,
    CommunicationRoomService
  ) {
    CommunicationUserService.initialize();
    CommunicationRoomService.initialize();
  }
);
