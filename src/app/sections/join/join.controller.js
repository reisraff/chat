'use strict';

angular.module('app').controller(
  'JoinController',
  /* @ngInject */
  function (JoinService) {
    var _self = this;

    _self.formObj = {
      user : {
        name: null,
        email: null,
        password: null
      }
    };

    _self.submitForm = function () {
      JoinService.register(_self.formObj);
    };
  }
);
