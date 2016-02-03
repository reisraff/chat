'use strict';

angular.module('app').controller(
  'LoginController',
  /* @ngInject */
  function (LoginService) {
    var _self = this;

    _self.formObj = {
      user : {
        user: null,
        password: null
      }
    };

    _self.submitForm = function (form) {
      if (form.$valid) {
        LoginService.authenticate(_self.formObj);
      }
    };
  }
);
