'use strict';

angular.module('app').service(
  /* @ngInject */
  'NavbarService',
  function ($state, CommunicationUserService, MessagingService, CommunicationEvents, AlertingService) {
    this.getAdministrator = function () {
      return CommunicationUserService.getUser();
    };

    this.logout = function () {
      var events = {};

      events.complete = MessagingService.subscribe(CommunicationEvents.user._LOGOUT_COMPLETE_, function () {
        MessagingService.unsubscribe(events.fail);
        AlertingService.success('Logout Efetuado com Sucesso');
        $state.go('root.login');
      }, true);

      events.fail = MessagingService.subscribe(CommunicationEvents.user._LOGOUT_FAIL_, function (err) {
        MessagingService.unsubscribe(events.complete);
        AlertingService.danger(err.data);
      }, true);

      MessagingService.publish(CommunicationEvents.user._LOGOUT_);
    };
  }
);
