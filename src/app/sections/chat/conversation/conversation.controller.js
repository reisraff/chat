'use strict';

angular.module('app').controller(
  'ConversationController',
  /* @ngInject */
  function (ConversationService, $state, $stateParams, mySocket, CommunicationUserService) {
    var _self = this;

    _self.user = CommunicationUserService.getUser();

    _self.room = {
      name : $stateParams.room ? $stateParams.room : null,
      description: null,
      messages: []
    };

    _self.formObj = {
      message: null
    };

    if (_self.room.name) {
      ConversationService.updateRoom(_self.room.name).then(function(res) {
        if (!! res) {
          _self.room = res;
        }
      });

      _self.formSubmit = function () {
        mySocket.emit(
          'send',
          {
            authorization: _self.user.authorization,
            room: _self.room.name,
            user: _self.user.name,
            message: _self.formObj.message
          }
        );
        _self.room.messages.push(_self.user.name + ': ' + _self.formObj.message);
        _self.formObj.message = null;
      };

      _self.leave = function () {
        mySocket.emit(
          'leave',
          {
            authorization: _self.user.authorization,
            room: _self.room.name,
            user: _self.user.name
          }
        );

        $state.go('root.home.chat');
      };

      mySocket.on('leave', function (data) {
        if (data.room === _self.room.name) {
          _self.room.messages.push(data.message);
        }
      });

      mySocket.on('receive', function (data) {
        if (data.room === _self.room.name) {
          _self.room.messages.push(data.message);
        }
      });

      mySocket.emit(
        'join',
        {
          authorization: _self.user.authorization,
          room: _self.room.name,
          user: _self.user.name
        }
      );

      mySocket.on('join', function (data) {
        if (data.room === _self.room.name) {
          _self.room.messages.push(data.message);
        }
      });

    }
  }
);
