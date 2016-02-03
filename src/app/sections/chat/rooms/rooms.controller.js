'use strict';

angular.module('app').controller(
  'RoomsController',
  /* @ngInject */
  function (RoomsService) {
    var _self = this;

    _self.buttonValue = 'Add';

    _self.initialFormObj = {
      room : {
        name: null,
        description: null
      }
    };

    _self.formObj = angular.copy(_self.initialFormObj);

    _self.formSubmit = function () {
      RoomsService.create(_self.formObj);

      _self.formObj = angular.copy(_self.initialFormObj);
      _self.buttonValue = 'Add';
    };
  }
);
