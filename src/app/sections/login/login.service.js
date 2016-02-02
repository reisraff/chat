'use strict';

angular.module('app').service(
  'LoginService',
  /* @ngInject */
  function ($q, $state, MessagingService, CommunicationEvents, AlertingService) {
    this.authenticate = function (authData) {
      var events = {};

      events.complete = MessagingService.subscribe(CommunicationEvents.administrator._AUTHENTICATE_COMPLETE_, function () {
        MessagingService.unsubscribe(events.fail);
        AlertingService.success('Login successfully');
        $state.go('root.home');
      }, true);

      events.fail = MessagingService.subscribe(CommunicationEvents.administrator._AUTHENTICATE_FAIL_, function () {
        MessagingService.unsubscribe(events.complete);
        AlertingService.danger('Authentication dained.');
      }, true);

      MessagingService.publish(
        CommunicationEvents.administrator._AUTHENTICATE_,
        [authData]
      );
    };
  }
);
