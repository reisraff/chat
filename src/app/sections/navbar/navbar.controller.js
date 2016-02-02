'use strict';

angular.module('app').controller(
  'NavbarController',
  /* @ngIject */
  function (NavbarService, MessagingService, CommunicationEvents) {
    var _self = this;
    _self.user = NavbarService.getAdministrator();
    _self.user.logged = !! _self.user.token ? true : false;

    MessagingService.subscribe(
      CommunicationEvents.user._SYNCED_,
      function () {
        _self.user = NavbarService.getAdministrator();
        _self.user.logged = !! _self.user.token ? true : false;
      }
    );

    this.logout = function () {
      NavbarService.logout();
    };
  }
);
