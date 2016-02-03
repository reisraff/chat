'use strict';

angular.module('app').service(
  'RoomsService',
  /* @ngInject */
  function ($q, MessagingService, CommunicationEvents, AlertingService) {
    this.create = function (data) {
      var events = {};

      events.complete = MessagingService.subscribe(CommunicationEvents.room._CREATE_COMPLETE_, function () {
        MessagingService.unsubscribe(events.fail);
        AlertingService.success('Room Created successfully');
      }, true);

      events.fail = MessagingService.subscribe(CommunicationEvents.room._CREATE_FAIL_, function () {
        MessagingService.unsubscribe(events.complete);
      }, true);

      MessagingService.publish(
        CommunicationEvents.room._CREATE_,
        [data]
      );
    };

    this.updateList = function () {
      var deferred = $q.defer();
      var events = {};

      events.complete = MessagingService.subscribe(CommunicationEvents.room._LIST_COMPLETE_, function (res) {
        deferred.resolve(res.getList());
        MessagingService.unsubscribe(events.fail);
      }, true);

      events.fail = MessagingService.subscribe(CommunicationEvents.room._LIST_FAIL_, function () {
        deferred.resolve(false);
        MessagingService.unsubscribe(events.complete);
      }, true);

      MessagingService.publish(
        CommunicationEvents.room._LIST_,
        []
      );

      return deferred.promise;
    };
  }
);
