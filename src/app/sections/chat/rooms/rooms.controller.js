'use strict';

angular.module('app').controller(
  'RoomsController',
  /* @ngInject */
  function ($interval, RoomsService) {
    var _self = this;

    _self.buttonValue = 'Add';

    _self.initialFormObj = {
      room : {
        name: null,
        description: null
      }
    };

    _self.formObj = angular.copy(_self.initialFormObj);

    _self.rooms = [];

    _self.formSubmit = function () {
      RoomsService.create(_self.formObj);

      _self.formObj = angular.copy(_self.initialFormObj);
      _self.buttonValue = 'Add';
    };

    function updateList() {
      RoomsService.updateList().then(function(res) {
        if (!! res) {
          _self.rooms = res;
        }
      });
    }

    updateList();

    $interval(function() {
      updateList();
    }, 3000);
  }
);
