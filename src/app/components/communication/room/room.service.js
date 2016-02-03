'use strict';

angular.module('app.communication').service(
  'CommunicationRoomService',
  /* @ngInject */
  function ($q, $rootScope, Restangular, MessagingService, CommunicationEvents, Room) {
    var _self = this;

    this.initialize = function () {
      MessagingService.subscribe(
        CommunicationEvents.room._CREATE_,
        _self.create
      );
    };

    this.create = function (data) {
      MessagingService.publish(CommunicationEvents.room._CREATE_START_);
      Restangular.one('chat/').post('room', data).then(
        function () {

          var room = new Room();
          room.setData({ data : data.room });

          MessagingService.publish(
            CommunicationEvents.room._CREATE_COMPLETE_,
            [room]
          );
        },
        function (err) {
          MessagingService.publish(
            CommunicationEvents.room._CREATE_FAIL_,
            [err]
          );
        }
      );
    };

  }
)
.value(
  'Room',
  function Room () {
    this.name = null;
    this.email = null;

    this.setData = function (data) {
      this.name = data.data.name;
      this.email = data.data.email;
    };

    this.clearData = function () {
      this.setData(
        {
          data : {}
        }
      );
    };

    this.getJsonData = function () {
      return JSON.stringify({
        name: this.name,
        email: this.email
      });
    };

    this.getJsonObj = function () {
      return {
        name: this.name,
        email: this.email
      };
    };
  }
);
