'use strict';

angular.module('app').service(
  'ConversationService',
  /* @ngInject */
  function ($q, MessagingService, CommunicationEvents) {
    var _self = this;

    _self.updateRoom = function (roomName) {
      var deferred = $q.defer();
      var events = {};

      events.complete = MessagingService.subscribe(CommunicationEvents.room._GET_COMPLETE_, function (res) {
        deferred.resolve(res);
        MessagingService.unsubscribe(events.fail);
      }, true);

      events.fail = MessagingService.subscribe(CommunicationEvents.room._GET_FAIL_, function () {
        deferred.resolve(false);
        MessagingService.unsubscribe(events.complete);
      }, true);

      MessagingService.publish(
        CommunicationEvents.room._GET_,
        [roomName]
      );

      return deferred.promise;
    };
  }
);
