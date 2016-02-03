'use strict';

angular.module('app').controller(
  'NavbarController',
  /* @ngIject */
  function (NavbarService, MessagingService, CommunicationEvents) {
    var _self = this;
    _self.user = NavbarService.getUser();
    _self.user.logged = !! _self.user.authorization ? true : false;

    MessagingService.subscribe(
      CommunicationEvents.user._SYNCED_,
      function () {
        _self.user = NavbarService.getUser();
        _self.user.logged = !! _self.user.authorization ? true : false;
      }
    );

    this.logout = function () {
      NavbarService.logout();
    };
  }
);
