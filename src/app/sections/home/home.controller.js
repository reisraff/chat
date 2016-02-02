'use strict';

angular.module('app').controller(
  'HomeController',
  /* @ngInject */
  function (HomeService) {
    var _self = this;
    _self.administrator = HomeService.getAdministrator();
  }
);
