'use strict';

angular.module('app').controller(
  'AlertingController',
  /* @ngInject */
  function (AlertingService) {
    var _self = this;
    _self.alerts = {
      success : [],
      info : [],
      warning : [],
      danger : []
    };

    this.close = function (obj) {
      _self.alerts[obj.type].shift(obj);
    };

    AlertingService.initialize(_self.alerts);
  }
);
