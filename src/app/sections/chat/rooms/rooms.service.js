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
  }
);
