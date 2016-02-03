'use strict';

angular.module('app.communication').service(
  'CommunicationRoomService',
  /* @ngInject */
  function ($q, $rootScope, Restangular, MessagingService, CommunicationEvents, Room, Collection) {
    var _self = this;

    this.initialize = function () {
      MessagingService.subscribe(
        CommunicationEvents.room._CREATE_,
        _self.create
      );

      MessagingService.subscribe(
        CommunicationEvents.room._LIST_,
        _self.list
      );

      MessagingService.subscribe(
        CommunicationEvents.room._GET_,
        _self.get
      );

      MessagingService.subscribe(
        CommunicationEvents.room._DELETE_,
        _self.delete
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

    this.list = function () {
      MessagingService.publish(CommunicationEvents.room._LIST_START_);
      Restangular.one('chat/room').get().then(
        function (res) {
          var collection = new Collection();
          angular.forEach(res.data, function (value) {
            var room = new Room();
            room.setData({ data : value });
            collection.add(room.getJsonObj());
          });

          MessagingService.publish(
            CommunicationEvents.room._LIST_COMPLETE_,
            [collection]
          );
        },
        function (err) {
          MessagingService.publish(
            CommunicationEvents.room._LIST_FAIL_,
            [err]
          );
        }
      );
    };

    this.get = function (roomName) {
      MessagingService.publish(CommunicationEvents.room._GET_START_);
      Restangular.one('chat/room').one(roomName).get().then(
        function (res) {
          var room = new Room();
          room.setData(res);
          MessagingService.publish(
            CommunicationEvents.room._GET_COMPLETE_,
            [room.getJsonObj()]
          );
        },
        function (err) {
          MessagingService.publish(
            CommunicationEvents.room._GET_FAIL_,
            [err]
          );
        }
      );
    };

    this.delete = function (roomName) {
      MessagingService.publish(CommunicationEvents.room._DELETE_START_);
      Restangular.one('chat/room').one(roomName).remove().then(
        function () {
          MessagingService.publish(
            CommunicationEvents.room._DELETE_COMPLETE_,
            []
          );
        },
        function (err) {
          MessagingService.publish(
            CommunicationEvents.room._DELETE_FAIL_,
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
    this.description = null;
    this.messages = [];

    this.setData = function (data) {
      this.name = data.data.name;
      this.description = data.data.description;
      this.messages = data.data.messages;
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
        description: this.description,
        messages: this.messages
      });
    };

    this.getJsonObj = function () {
      return {
        name: this.name,
        description: this.description,
        messages: this.messages
      };
    };
  }
);
