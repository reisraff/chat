'use strict';

angular.module('app').service(
  'LoginService',
  /* @ngInject */
  function ($q, $state, MessagingService, CommunicationEvents, AlertingService) {
    this.authenticate = function (authData) {
      var events = {};

      events.complete = MessagingService.subscribe(CommunicationEvents.user._AUTHENTICATE_COMPLETE_, function () {
        MessagingService.unsubscribe(events.fail);
        AlertingService.success('Login successfully');
        $state.go('root.home.chat');
      }, true);

      events.fail = MessagingService.subscribe(CommunicationEvents.user._AUTHENTICATE_FAIL_, function () {
        MessagingService.unsubscribe(events.complete);
      }, true);

      MessagingService.publish(
        CommunicationEvents.user._AUTHENTICATE_,
        [authData]
      );
    };
  }
);
