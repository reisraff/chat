'use strict';

angular.module('app').service(
  'JoinService',
  /* @ngInject */
  function ($q, $state, MessagingService, CommunicationEvents, AlertingService) {
    this.register = function (authData) {
      var events = {};

      events.complete = MessagingService.subscribe(CommunicationEvents.user._REGISTER_COMPLETE_, function (res) {
        console.log(res);
        MessagingService.unsubscribe(events.fail);
        AlertingService.success('Register successfully');
        $state.go('root.login');
      }, true);

      events.fail = MessagingService.subscribe(CommunicationEvents.user._REGISTER_FAIL_, function () {
        MessagingService.unsubscribe(events.complete);
        AlertingService.danger('Register unsuccessfully');
      }, true);

      MessagingService.publish(
        CommunicationEvents.user._REGISTER_,
        [authData]
      );
    };
  }
);
