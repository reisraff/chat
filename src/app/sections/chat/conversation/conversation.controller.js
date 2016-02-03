'use strict';

angular.module('app').controller(
  'ConversationController',
  /* @ngInject */
  function (ConversationService, $stateParams) {
    var _self = this;

    _self.room = {
      name : $stateParams.room ? $stateParams.room : null,
      description: null,
      messages: null
    };

    if (_self.room.name) {
      ConversationService.updateRoom(_self.room.name).then(function(res) {
        if (!! res) {
          _self.room = res;
        }
      });

      // everything else
    }
  }
);
